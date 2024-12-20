import ClubCard from "../club/clubCard";

export default function Profile() {

  return (
    <>
      <div className="flex flex-col items-center">
        <div className="flex flex-row items-center w-2/3 h-80 mt-16 justify-between border-4 rounded-xl border-cyan-300 shadow-md shadow-cyan-300/50">
          <div
            className="flex flex-col items-center w-1/4 h-4/5 ml-8 border-2 rounded-xl border-cyan-300 shadow-md shadow-cyan-300/50">
            <div className="flex flex-row items-center justify-evenly w-full h-1/4 text-lg font-bold">
              <div>
                Name:
              </div>
              <div>
                Testing Name
              </div>
            </div>
            <div className="flex flex-row items-center justify-evenly w-full h-1/4 text-lg font-bold">
              <div>
                SID:
              </div>
              <div>
                Testing SID
              </div>
            </div>
            <div className="flex flex-row items-center justify-evenly w-full h-1/4 text-lg font-bold">
              <div>
                Branch:
              </div>
              <div>
                Testing Branch
              </div>
            </div>
            <div className="flex flex-row items-center justify-evenly w-full h-1/4 text-lg font-bold">
              <div>
                Semester:
              </div>
              <div>
                Testing Semester
              </div>
            </div>
          </div>
          <img  src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTfXKzxBrv-nr-V2w6n-Hf14w-Mw-p4tD_f6GPvjOCW4CoikavWniBoh4rNfKid-VyUwH4&usqp=CAU" className="flex flex-col items-center w-1/5 h-4/5 mr-8 border-2 rounded-full border-cyan-300 shadow-md shadow-cyan-300/50" />
          </div>
          <div className="w-2/3 text-2xl font-bold mt-12">
            Joined Clubs
          </div>
          <div className="flex flex-row w-2/3 h-96 mt-4 border-4 rounded-xl border-cyan-300 shadow-md shadow-cyan-300/50">
            <div className="flex flex-col justify-evenly h-full w-3/4">
              <ClubCard />
              <ClubCard />
              <ClubCard />
            </div>
            <div className="flex flex-col items-center h-full w-1/4">
              <button className="text-lg font-bold h-1/6 bg-gradient-to-br from-cyan-600 to-cyan-400 text-white w-4/6 rounded-full mt-8">
                Show All Joined Clubs
              </button>
              <div className="text-xl font-bold mt-8">
                Number of Clubs joined:
              </div>
            </div>
          </div>
      </div>
    </>
  )
}