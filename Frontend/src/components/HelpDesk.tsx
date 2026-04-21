import { EnquiryForm } from "../components/EnquiryForm";

export const HelpDesk = () => {
  return (
    <section className="py-20">
      <h1 className="text-3xl text-center mb-8">Student Help Desk</h1>

      <div className="max-w-2xl mx-auto">
        <EnquiryForm />
      </div>
    </section>
  );
};