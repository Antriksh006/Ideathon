import dbConnect from "../../../lib/connectDb";
import { EventModel } from "../../../model/User";
import { NextResponse } from "next/server";
import {getServerSession, User} from "next-auth";
import {authOptions} from "../(auth)/auth/[...nextauth]/options";
import mongoose from "mongoose";

export async function GET(request: Request) {
    try {
      await dbConnect();

      const session = await getServerSession(authOptions);
      const user: User = session?.user as User;

      if (!session || !user) {
        return NextResponse.json({ error: 'Unauthorized. User must be logged in.' }, { status: 401 });
      }

      const userId = new mongoose.Types.ObjectId(user._id);

      const events = await EventModel.aggregate([
        {
          $addFields: {
            isInterested: {
              $cond: {
                if: { $in: [userId, "$interestedMembersArr"] },
                then: true,
                else: false,
              }
            }
          }
        },
        {
          $lookup: {
            from: "clubs",
            localField: "eventHostedBy",
            foreignField: "_id",
            as: "eventHostedBy"
          }
        },
        {
          $unwind: "$eventHostedBy"
        },
        {
          $project: {
            _id: 1,
            poster: 1,
            heading: 1,
            eventHostedBy: "$eventHostedBy.clubName",
            description: 1,
            tags: 1,
            eventTime: 1,
            eventVenue: 1,
            isInterested: 1,
          }
        }
      ]);

      if (!events) {
        return NextResponse.json({error: 'No events found'}, {status: 404});
      }
      return NextResponse.json(events, { status: 200 });

    } catch (error) {
      console.error(error);
      return NextResponse.json({ error: 'An error occurred while fetching events.' }, { status: 500 });
    }
  }