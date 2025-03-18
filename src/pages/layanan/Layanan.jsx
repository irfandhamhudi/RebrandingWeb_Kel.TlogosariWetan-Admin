import { useEffect, useState } from "react";
import {
  getAllServiceComplain,
  deleteServiceComplain,
} from "../../utils/data/serviceComplain";
import HashLoader from "react-spinners/HashLoader";
import toast from "react-hot-toast";
import Swal from "sweetalert2";

const Layanan = () => {
  const [serviceComplaints, setServiceComplaints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fungsi untuk mengambil data service complaints
  const fetchServiceComplaints = async () => {
    try {
      const response = await getAllServiceComplain();
      if (response.success) {
        setServiceComplaints(response.data); // Simpan data ke state
      } else {
        setError("Gagal mengambil data");
      }
    } catch (err) {
      setError(err.message); // Tangani error
    } finally {
      setLoading(false); // Set loading ke false setelah selesai
    }
  };

  // Gunakan useEffect untuk memanggil fungsi fetch saat komponen dimuat
  useEffect(() => {
    fetchServiceComplaints();
  }, []);

  const handleDelete = async (id) => {
    // Konfirmasi penghapusan dengan sweetalert2
    Swal.fire({
      title: "Apakah Anda yakin?",
      text: "Anda tidak dapat mengembalikan data ini!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Ya, hapus!",
      cancelButtonText: "Batal",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          const response = await deleteServiceComplain(id);
          if (response.success) {
            // Hapus data dari state
            setServiceComplaints(
              serviceComplaints.filter((complaint) => complaint._id !== id)
            );
            // Tampilkan notifikasi sukses
            toast.success(response.message);
          } else {
            // Tampilkan notifikasi error
            toast.error(response.message);
          }
        } catch (err) {
          // Tampilkan notifikasi error
          toast.error(err.message);
        }
      }
    });
  };

  // Tampilkan loading jika data masih diambil
  if (loading) {
    return (
      <div className="h-full fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 items-center justify-center bg-black bg-opacity-50 w-full flex z-50">
        <HashLoader color="#C0392B" size={50} />
      </div>
    );
  }

  // Tampilkan pesan error jika terjadi kesalahan
  if (error) {
    return <div>Error: {error}</div>;
  }

  const createDate = (dateString) => {
    const date = new Date(dateString);
    const options = { day: "numeric", month: "long", year: "numeric" };
    return date.toLocaleDateString("id-ID", options);
  };

  return (
    <div className="min-h-screen p-5">
      <div className="space-y-2">
        <h1 className="text-2xl font-medium">Pengaduan Layanan</h1>
        <p className="text-font3">
          Pengaduan Layanan Kelurahan Tlogosari Wetan
        </p>
      </div>

      {/* Tabel untuk menampilkan data */}
      <div className="mt-5 overflow-x-auto ">
        <table className="min-w-full bg-white border border-gray-300 text-sm">
          <thead className="bg-primary text-white">
            <tr>
              <th className="py-2 px-4 border">No</th>
              <th className="py-2 px-4 border">Nama</th>
              <th className="py-2 px-4 border">Email</th>
              <th className="py-2 px-4 border">No. Telepon</th>
              <th className="py-2 px-4 border">Pesan</th>
              <th className="py-2 px-4 border">Gambar</th>
              <th className="py-2 px-4 border">Waktu</th>
              <th className="py-2 px-4 border">Aksi</th>
            </tr>
          </thead>
          <tbody>
            {serviceComplaints.map((complaint, index) => (
              <tr key={complaint._id} className="hover:bg-gray-50 text-sm">
                <td className="py-2 px-4 border text-center">{index + 1}</td>
                <td className="py-2 px-4 border text-center">
                  {complaint.name}
                </td>
                <td className="py-2 px-4 border text-center">
                  {complaint.email}
                </td>
                <td className="py-2 px-4 border text-center">
                  {complaint.phone}
                </td>
                <td className="py-2 px-4 border text-justify">
                  {complaint.msg}
                </td>
                <td className="py-2 px-4 border">
                  <div className="gap-3 flex flex-col items-center justify-center">
                    {complaint.images && complaint.images.length > 0 ? (
                      complaint.images.map((image, idx) => (
                        <img
                          key={idx}
                          src={image}
                          alt={`Gambar ${idx + 1}`}
                          className="w-16 h-16 object-cover rounded"
                        />
                      ))
                    ) : (
                      <span>Tidak ada gambar</span>
                    )}
                  </div>
                </td>
                <td className="py-2 px-4 border-b text-center">
                  {createDate(complaint.createdAt)}
                </td>
                <td className="py-2 px-4 border">
                  <div className="flex items-center justify-center">
                    <button
                      onClick={() => handleDelete(complaint._id)}
                      className="bg-primary hover:bg-secondary text-white py-1 px-4 rounded"
                    >
                      Hapus
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Layanan;
