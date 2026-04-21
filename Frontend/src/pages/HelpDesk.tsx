import { EnquiryForm } from "@/components/EnquiryForm";

const HelpDesk = () => {
  return (
    <div className="p-6 pt-24">
      <h2 className="text-xl font-bold">Help Desk</h2>
      <EnquiryForm/>

      <p className="my-3">📞 9876543210</p>

      {/* existing form yaha reuse karo */}
    </div>
  );
};

export default HelpDesk;