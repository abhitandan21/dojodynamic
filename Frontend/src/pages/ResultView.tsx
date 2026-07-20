import {
    useParams,
    useSearchParams
} from "react-router-dom";

import {
    useEffect,
    useState
} from "react";

import generateResultPdf
    from "../utils/generateResultPdf";

const API =
    "http://localhost:4001/api";
    "https://api.amaasa.com";

// deploy ke time
// const API =
// "https://dojodynamic222.onrender.com/api";

const ResultView = () => {

    const { session } =
        useParams();

    const [searchParams] =
        useSearchParams();

    const registrationNo =
        searchParams.get("reg");

    const [result, setResult] =
        useState<any>(null);

    const [loading, setLoading] =
        useState(true);

    useEffect(() => {

        if (
            !session ||
            !registrationNo
        )
            return;

        fetch(

            `${API}/result/

${encodeURIComponent(
                session
            )}

/

${encodeURIComponent(
                registrationNo
            )}`

                .replace(/\n/g, "")

        )

            .then((res) => {

                if (!res.ok)
                    throw new Error(
                        "Result Not Found"
                    );

                return res.json();
            })

            .then((data) => {

                setResult(data);

                console.log(data);

                setLoading(false);

            })

            .catch(() => {

                setLoading(false);

            });

    }, [
        session,
        registrationNo
    ]);

    if (loading)
        return (
            <div className="pt-28 p-6 text-center">
                Loading...
            </div>
        );

    if (!result)
        return (
            <div className="pt-28 p-6 text-center">

                <h2 className="text-2xl font-bold text-red-500">

                    Result Not Found

                </h2>

            </div>
        );

    return (
        <div className="pt-28 p-6">

            <div
                id="result-sheet"
                className="
      max-w-5xl
      mx-auto
      bg-white
      text-black
      p-8
      rounded-xl
      shadow-xl
      "
            >

                {/* Heading */}

                <h1 className="text-4xl font-bold text-center">

                    ABHISHEK MARTIAL ARTS
                    <br />
                    AND SPORTS ACADEMY RISALI BHILAI

                </h1>
                <h3 className="text-2xl font-bold text-center">

                    AFFIATED WITH PHONIEX SHITO RYU KARATE DO ASSOCIATION INDIA


                </h3>

                <h2 className="text-2xl font-bold text-center mt-6">

                    BELT EXAMINATION RESULT

                </h2>

                {/* Student Details */}

                <table className="w-full mt-10">

                    <tbody>

                        <tr className="bg-gray-100">

                            <td className="p-4 font-semibold">
                                Registration No
                            </td>

                            <td className="p-4">
                                {result.registrationNo}
                            </td>

                        </tr>

                        <tr>

                            <td className="p-4 font-semibold">
                                Student Name
                            </td>

                            <td className="p-4">
                                {result.studentName}
                            </td>

                        </tr>

                        <tr className="bg-gray-100">

                            <td className="p-4 font-semibold">
                                Father Name
                            </td>

                            <td className="p-4">
                                {result.fatherName}
                            </td>

                        </tr>

                        <tr>

                            <td className="p-4 font-semibold">
                                Current Belt
                            </td>

                            <td className="p-4">
                                {result.currentBelt}
                            </td>

                        </tr>

                        <tr className="bg-gray-100">

                            <td className="p-4 font-semibold">
                                Exam Date
                            </td>

                            <td className="p-4">
                                {result.examDate}
                            </td>

                        </tr>

                        {/* <tr>

                            <td className="p-4 font-semibold">
                                Certificate No
                            </td>

                            <td className="p-4">
                                {result.certificateNo}
                            </td>

                        </tr> */}

                    </tbody>

                </table>

                {/* Marks Table */}

                <table className="w-full mt-10 border">

                    <thead>

                        <tr className="bg-blue-600 text-white">

                            <th className="p-4 border">
                                Category
                            </th>

                            <th className="border">
                                Maximum
                            </th>

                            <th className="border">
                                Minimum
                            </th>

                            <th className="border">
                                Obtained
                            </th>

                            <th className="border">
                                Status
                            </th>

                        </tr>

                    </thead>

                    <tbody>

                        <tr>

                            <td className="border p-3">
                                Written Test
                            </td>

                            <td className="border text-center">
                                {result.writtenTest.max}
                            </td>

                            <td className="border text-center">
                                {result.writtenTest.min}
                            </td>

                            <td className="border text-center">
                                {result.writtenTest.obtained}
                            </td>

                            <td className="border text-center">

                                {result.writtenTest.status}

                            </td>

                        </tr>

                        <tr className="bg-gray-100">

                            <td className="border p-3">
                                Oral Test
                            </td>

                            <td className="border text-center">
                                {result.oralTest.max}
                            </td>

                            <td className="border text-center">
                                {result.oralTest.min}
                            </td>

                            <td className="border text-center">
                                {result.oralTest.obtained}
                            </td>

                            <td className="border text-center">

                                {result.oralTest.status}

                            </td>

                        </tr>

                        <tr>

                            <td className="border p-3">
                                Technical Performance
                            </td>

                            <td className="border text-center">
                                {result.technicalPerformance.max}
                            </td>

                            <td className="border text-center">
                                {result.technicalPerformance.min}
                            </td>

                            <td className="border text-center">
                                {result.technicalPerformance.obtained}
                            </td>

                            <td className="border text-center">

                                {
                                    result.technicalPerformance
                                        .status
                                }

                            </td>

                        </tr>

                        {/* Extra Content */}

                        <tr className="bg-gray-100">

                            <td className="border p-3">
                                Punctuality &
                                Behaviour
                            </td>

                            <td className="border text-center">
                                5
                            </td>

                            <td className="border text-center">
                                -
                            </td>

                            <td className="border text-center">
                                {result.punctuality}
                            </td>

                            <td className="border text-center">
                                PASS
                            </td>

                        </tr>

                        <tr>

                            <td className="border p-3">
                                Dojo Rules &
                                Cleanliness
                            </td>

                            <td className="border text-center">
                                5
                            </td>

                            <td className="border text-center">
                                -
                            </td>

                            <td className="border text-center">
                                {result.dojoRules}
                            </td>

                            <td className="border text-center">
                                PASS
                            </td>

                        </tr>

                        <tr className="bg-gray-100">

                            <td className="border p-3">
                                Attendance
                            </td>

                            <td className="border text-center">
                                10
                            </td>

                            <td className="border text-center">
                                -
                            </td>

                            <td className="border text-center">
                                {result.attendance}
                            </td>

                            <td className="border text-center">
                                PASS
                            </td>

                        </tr>

                        <tr>

                            <td className="border p-3">
                                Extra Practice
                            </td>

                            <td className="border text-center">
                                5
                            </td>

                            <td className="border text-center">
                                -
                            </td>

                            <td className="border text-center">
                                {result.extraPractice}
                            </td>

                            <td className="border text-center">
                                PASS
                            </td>
                        </tr> 

                            <tr>

                                <td className="border p-3">
                                    Competition
                                </td>

                                <td className="border text-center">
                                    10
                                </td>

                                <td className="border text-center">
                                    -
                                </td>

                                <td className="border text-center">
                                    {result.competition}
                                </td>

                                <td className="border text-center">
                                    PASS
                                </td>

                            </tr>

                            <tr>

                                <td className="border p-3">
                                    Super Achiever
                                </td>

                                <td className="border text-center">
                                    5
                                </td>

                                <td className="border text-center">
                                    -
                                </td>

                                <td className="border text-center">
                                    {result.superAchiever}
                                </td>

                                <td className="border text-center">
                                    PASS
                                </td>

                            </tr>

                            <tr className="bg-gray-100">

                                <td className="border p-3">
                                    Personal Growth &
                                    Skill Improvement
                                </td>

                                <td className="border text-center">
                                    5
                                </td>

                                <td className="border text-center">
                                    -
                                </td>

                                <td className="border text-center">
                                    {result.personalGrowth}
                                </td>

                                <td className="border text-center">
                                    PASS
                                </td>

                            </tr>

                            <tr>

                                <td className="border p-3">
                                    Leadership &
                                    Confidence
                                </td>

                                <td className="border text-center">
                                    5
                                </td>

                                <td className="border text-center">
                                    -
                                </td>

                                <td className="border text-center">
                                    {result.leadership}
                                </td>

                                <td className="border text-center">
                                    PASS
                                </td>

                            </tr>

                            <tr className="bg-gray-100">

                                <td className="border p-3">
                                    Teamwork &
                                    Helping Others
                                </td>

                                <td className="border text-center">
                                    5
                                </td>

                                <td className="border text-center">
                                    -
                                </td>

                                <td className="border text-center">
                                    {result.teamwork}
                                </td>

                                <td className="border text-center">
                                    PASS
                                </td>

                            </tr>

                            <tr>

                                <td className="border p-3">
                                    Mental Strength &
                                    Focus
                                </td>

                                <td className="border text-center">
                                    5
                                </td>

                                <td className="border text-center">
                                    -
                                </td>

                                <td className="border text-center">
                                    {result.mentalStrength}
                                </td>

                                <td className="border text-center">
                                    PASS
                                </td>

                            </tr>

                        

                    </tbody>

                </table>

                {/* Summary */}

                <table className="w-full mt-10">

                    <tbody>

                        <tr className="bg-gray-100">

                            <td className="p-4 font-semibold">
                                Grand Total
                            </td>

                            <td className="p-4">

                                {result.grandTotal}/200

                            </td>

                        </tr>

                        <tr>

                            <td className="p-4 font-semibold">
                                Percentage
                            </td>

                            <td className="p-4">

                                {result.percentage}%

                            </td>

                        </tr>

                        <tr className="bg-gray-100">

                            <td className="p-4 font-semibold">
                                Grade
                            </td>

                            <td className="p-4">

                                {result.grade}

                            </td>

                        </tr>

                        <tr>

                            <td className="p-4 font-semibold">
                                Result
                            </td>

                            <td
                                className={`p-4 font-bold ${result.result === "PASS"
                                    ? "text-green-600"
                                    : "text-red-600"
                                    }`}
                            >

                                {result.result}

                            </td>

                        </tr>

                    </tbody>

                </table>

                {/* Download */}

                <button
                    onClick={() =>
                        generateResultPdf(result)
                    }
                    className="
  mt-10
  bg-red-600
  text-white
  px-6
  py-3
  rounded-lg
  "
                >
                    Download PDF
                </button>
            </div>

        </div>
    );

};

export default ResultView;