// import React, { useState, useEffect, useRef } from "react";
// import useAxiosPrivate from "../hooks/useAxiosPrivate";

// const Protected = () => {
//   const axiosPrivate = useAxiosPrivate();
//   const isRun = useRef(false);
//   const [data, setData] = useState(null);

//   useEffect(() => {
//     if (isRun.current) return;  
//     isRun.current = true;

//     const getDocuments = async () => {
//       try {
//         const response = await axiosPrivate.get("/documents");
//         setData(response.data);
//       } catch (err) {
//         console.error(err);
//       } 
//     };

//     getDocuments();
//   }, [axiosPrivate]);
  

//   return data ? (
//     <>
//       {data.map((rec, i) => (
//         <h3 key={i}>{rec}</h3>
//       ))}
//     </>
//   ) : (
//     <div>Protected</div>
//   );
// };

// export default Protected;
 