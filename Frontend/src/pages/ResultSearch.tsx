import { useParams } from "react-router-dom";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

const ResultSearch = () => {

    const { session } = useParams();

    const navigate =
        useNavigate();

    const [regNo, setRegNo] =
        useState("");

    const searchResult = () => {

        if (!regNo) return;

        navigate(
            `/result-view/${session}?reg=${encodeURIComponent(regNo)}`
        );

    };

    return (

        <div className="pt-28 p-6">

            <h1
                className="
        text-3xl
        font-bold
        mb-6
      "
            >

                {decodeURIComponent(
                    session || ""
                )}

            </h1>

            <div
                className="
        bg-white
        p-8
        rounded-xl
        shadow-lg
        max-w-xl
      "
            >

                <h2
                    className="
          text-xl
          font-bold
          mb-5
        "
                >

                    Enter Registration Number

                </h2>

                <input

                    value={regNo}

                    onChange={(e) =>
                        setRegNo(
                            e.target.value
                        )
                    }

                    placeholder="
AMAASA/2025/001
"

                    className="
w-full
border
p-3
rounded-lg
mb-5
text-black
"

                />

                <button

                    onClick={searchResult}

                    className="
bg-red-600
text-white
px-6
py-3
rounded-lg
hover:bg-red-700
"

                >

                    Search Result

                </button>

            </div>

        </div>

    );

};

export default ResultSearch;