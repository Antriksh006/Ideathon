import {NextRequest, NextResponse} from "next/server";
import dbConnect from "../../../../../../lib/connectDb";
import {getServerSession, User} from "next-auth";
import {authOptions} from "../../../../(auth)/auth/[...nextauth]/options";
import mongoose from "mongoose";
import {ClubModel, StudentModel} from "../../../../../../model/User";

export async function PATCH(req: NextRequest,     { params }: { params: { clubId: string[] } }) {
  try {
    await dbConnect();

    const session = await getServerSession(authOptions);
    const user: User = session?.user as User;

    if (!session || !user) {
      return NextResponse.json({ error: 'Unauthorized. User must be logged in.' }, { status: 401 });
    }

    if (!user.isAdmin) {
      return NextResponse.json(
        { error: 'User is not admin' },
        { status: 401 }
      );
    }

    const {clubName, clubLogo, clubIdSecs, clubMembers, clubEvents} = await req.json();

    if (!clubName || clubLogo || !clubIdSecs.length) {
      return NextResponse.json(
        {error: "Data is missing"},
        {status: 403}
      );
    }

    const { clubId } = await params;

    if (!clubId.length) {
      return NextResponse.json(
        {error: 'Club ID is required'},
        {status: 403}
      )
    }

    console.log(clubId);

    if (!mongoose.Types.ObjectId.isValid(clubId[0])) {
      return NextResponse.json(
        {error: 'Club ID is invalid'},
        {status: 403}
      )
    }

    const clubObjectId = new mongoose.Types.ObjectId(clubId[0])

    const club = await ClubModel.findById(clubObjectId);

    if (!club) {
      return NextResponse.json(
        {error: 'Failed to update clubs'},
        {status: 500}
      )
    }

    const members = await StudentModel.aggregate([
      {
        $match: {
          $or: [
            {
              student_id: {
                $in: clubMembers,
              }
            },
            {
              student_id: {
                $in: club.clubMembers,
              }
            }
          ]
        }
      },
      {
        $set: {
          clubsPartOf: {
            $cond: {
              if : { $in: ["$student_id", clubMembers] },
              then: {
                cond: {
                  if: { $in: [club._id, "$clubsPartOf"] },
                  then: "$clubsPartOf",
                  else: { $concatArrays: ["$clubsPartOf", [club._id]] },
                }
              },
              else: {
                $filter: {
                  input: "$clubsPartOf",
                  as: "club",
                  cond: {
                    $ne: ["$$club", club._id]
                  }
                }
              }
            }
          }
        }
      }
    ])

    if (!members) {
      return NextResponse.json(
        {error: "failed to update members"},
        {status: 500}
      )
    }

    const secys = await StudentModel.aggregate([
      {
        $match: {
          $or: [
            {
              student_id: {
                $in: clubIdSecs,
              }
            },
            {
              student_id: {
                $in: club.clubIdSecs,
              }
            }
          ]
        }
      },
      {
        $set: {
          clubsHeadOf: {
            $cond: {
              if : { $in: ["$student_id", clubIdSecs] },
              then: {
                cond: {
                  if: { $in: [club._id, "$clubsHeadOf"] },
                  then: "$clubsHeadOf",
                  else: { $concatArrays: ["$clubsHeadOf", [club._id]] },
                }
              },
              else: {
                $filter: {
                  input: "$clubsHeadOf",
                  as: "club",
                  cond: {
                    $ne: ["$$club", club._id]
                  }
                }
              }
            }
          }
        }
      }
    ])

    if (!secys) {
      return NextResponse.json(
        {error: "failed to update secys"},
        {status: 500}
      )
    }

    club.clubName = clubName;
    club.clubLogo = clubLogo;
    club.clubMembers = clubMembers;
    club.clubIdSecs = clubIdSecs;
    club.clubEvents = clubEvents;

    await club.save();

    return NextResponse.json(club, {status: 200});

  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}