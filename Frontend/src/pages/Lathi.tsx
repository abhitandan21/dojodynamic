import { useEffect, useState } from "react";

const Lathi = () => {
  const [data, setData] = useState<any[]>([]);

  useEffect(() => {
    fetch("https://dojodynamic222.onrender.com/api/lathi")
      .then(res => res.json())
      .then(setData);
  }, []);

  return (
    <div className="p-6 pt-24 text-white bg-black min-h-screen">
      <h2 className="text-2xl mb-4">Lathi Records</h2>

      {data.map((item, i) => (
        <div key={i} className="mb-10">

          <h3 className="text-xl mb-2">{item.title}</h3>

          {item.records && item.records.length > 0 ? (
            <table className="w-full border border-gray-600">
              <thead>
                <tr className="bg-gray-800">
                  <th className="border p-2">#</th>
                  <th className="border p-2">Registration No</th>
                  <th className="border p-2">Name</th>
                   <th className="border p-2">Father</th>
                
                  
    
                </tr>
              </thead>

              <tbody>
                {item.records.map((r: any, index: number) => (
                  <tr key={index} className="text-center">
                    <td className="border p-2">{index + 1}</td>
                    <td className="border p-2">{r.registrationNo}</td>
                    <td className="border p-2">{r.name}</td>
                    <td className="border p-2">{r.fatherName}</td>
                   
                    
                    
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <p>No records found</p>
          )}

        </div>
      ))}
    </div>
  );
};

export default Lathi;