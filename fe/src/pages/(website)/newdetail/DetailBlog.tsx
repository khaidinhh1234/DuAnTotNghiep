// import instanceClient from "@/configs/client"
// import { useQuery } from "@tanstack/react-query"
// import { useParams } from "react-router-dom"

// const DetailBlog = () => {
//     const { duong_dan } = useParams()
//     const { data } = useQuery({
//         queryKey: ["blogDetail", duong_dan],
//         queryFn: async () => {
//             const response = await instanceClient.post(`/xem-bai-viet/${duong_dan}`)
//             console.log("Response data:", response.data);
//             return response.data
//         }
//     })
//     console.log("Duong dan:", duong_dan);
//     console.log("DetailBlog:", data)
//   return (
//     <div>
      
//     </div>
//   )
// }

// export default DetailBlog
