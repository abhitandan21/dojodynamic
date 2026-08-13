export interface StudentAttendance {
  _id: string;
  name: string;
  registrationNo: string;
  status: "Present" | "Absent";
}