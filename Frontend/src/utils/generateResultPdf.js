import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

const generateResultPdf = (result) => {
    try {
        const doc = new jsPDF();

        // Heading

        doc.setFontSize(18);

        doc.text(
            "ABHISHEK MARTIAL ARTS AND SPORTS ACADEMY",
            105,
            18,
            {
                align: "center",
            }
        );

        doc.setFontSize(11);

        doc.text(
            "Affiliated with Phoenix Shito Ryu Karate Do Association India",
            105,
            26,
            {
                align: "center",
            }
        );

        doc.setFontSize(14);

        doc.text(
            "BELT EXAMINATION RESULT",
            105,
            36,
            {
                align: "center",
            }
        );

        // Student Details

        autoTable(doc, {
            startY: 45,

            body: [
                [
                    "Registration No",
                    result.registrationNo || "-"
                ],

                [
                    "Student Name",
                    result.studentName || "-"
                ],

                [
                    "Father Name",
                    result.fatherName || "-"
                ],

                [
                    "Current Belt",
                    result.currentBelt || "-"
                ],

                [
                    "Exam Date",
                    result.examDate || "-"
                ],

                //[
                  // "Certificate No",
                    //result.certificateNo || "-"
               // ],
            ],
        });

        // Marks Table

        autoTable(doc, {
            startY:
                doc.lastAutoTable.finalY + 10,

            head: [
                [
                    "Category",
                    "Maximum",
                    "Minimum",
                    "Obtained",
                    "Status",
                ],
            ],

            body: [

                [
                    "Written Test",
                    50,
                    20,
                    result?.writtenTest
                        ?.obtained ??
                    result?.writtenTest ??
                    0,

                    result?.writtenTest
                        ?.status ??
                    (
                        (
                            result?.writtenTest
                                ?.obtained ??
                            result?.writtenTest ??
                            0
                        ) >= 20
                            ? "PASS"
                            : "FAIL"
                    ),
                ],

                [
                    "Oral Test",
                    15,
                    7,
                    result?.oralTest
                        ?.obtained ??
                    result?.oralTest ??
                    0,

                    result?.oralTest
                        ?.status ??
                    (
                        (
                            result?.oralTest
                                ?.obtained ??
                            result?.oralTest ??
                            0
                        ) >= 7
                            ? "PASS"
                            : "FAIL"
                    ),
                ],

                [
                    "Technical Performance",
                    75,
                    30,
                    result?.technicalPerformance
                        ?.obtained ??
                    result?.technicalPerformance ??
                    0,

                    result
                        ?.technicalPerformance
                        ?.status ??
                    (
                        (
                            result
                                ?.technicalPerformance
                                ?.obtained ??
                            result
                                ?.technicalPerformance ??
                            0
                        ) >= 30
                            ? "PASS"
                            : "FAIL"
                    ),
                ],

                [
                    "Punctuality",
                    5,
                    "-",
                    result.punctuality ?? 0,
                    "PASS",
                ],

                [
                    "Dojo Rules",
                    5,
                    "-",
                    result.dojoRules ?? 0,
                    "PASS",
                ],

                [
                    "Attendance",
                    10,
                    "-",
                    result.attendance ?? 0,
                    "PASS",
                ],

                [
                    "Extra Practice",
                    5,
                    "-",
                    result.extraPractice ?? 0,
                    "PASS",
                ],

                [
                    "Competition",
                    10,
                    "-",
                    result.competition ?? 0,
                    "PASS",
                ],

                [
                    "Super Achiever",
                    5,
                    "-",
                    result.superAchiever ?? 0,
                    "PASS",
                ],

                [
                    "Personal Growth",
                    5,
                    "-",
                    result.personalGrowth ?? 0,
                    "PASS",
                ],

                [
                    "Leadership",
                    5,
                    "-",
                    result.leadership ?? 0,
                    "PASS",
                ],

                [
                    "Teamwork",
                    5,
                    "-",
                    result.teamwork ?? 0,
                    "PASS",
                ],

                [
                    "Mental Strength",
                    5,
                    "-",
                    result.mentalStrength ?? 0,
                    "PASS",
                ],
            ],
        });

        // Summary

        autoTable(doc, {
            startY:
                doc.lastAutoTable.finalY + 10,

            body: [

                [
                    "Grand Total",
                    `${result.grandTotal || 0}/200`,
                ],

                [
                    "Percentage",
                    `${result.percentage || 0}%`,
                ],

                [
                    "Grade",
                    result.grade || "-",
                ],

                [
                    "Result",
                    result.result || "-",
                ],
            ],
        });

        doc.save(
            `${result.registrationNo}.pdf`
        );

    } catch (err) {

        console.log(err);

        alert(
            "PDF Download Error"
        );
    }
};

export default generateResultPdf;