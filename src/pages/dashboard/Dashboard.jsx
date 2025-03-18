import { useState, useEffect } from "react";
import { getAllData } from "../../utils/data/dataNewsAPI";
import { HashLoader } from "react-spinners";
import {
  createBidang,
  getAllBidang,
  deleteBidang,
} from "../../utils/data/bidangAPI";
import toast, { Toaster } from "react-hot-toast";
import Swal from "sweetalert2";
import { getAllUsers } from "../../utils/data/authAPI";

const Dashboard = () => {
  const [data, setData] = useState([]); // State untuk menyimpan data
  const [loading, setLoading] = useState(true); // State untuk menangani loading state
  const [error, setError] = useState(null); // State untuk menangani error
  const [bidangData, setBidangData] = useState([]); // State untuk menyimpan data bidang
  const [newBidang, setNewBidang] = useState(""); // State untuk menyimpan input bidang baru
  const [users, setUsers] = useState([]); // State untuk menyimpan data pengguna

  // Ambil data saat komponen di-mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await getAllData(); // Panggil fungsi getAllData
        setData(response.data); // Simpan data ke state
        setLoading(false); // Set loading menjadi false
      } catch (error) {
        console.error("Gagal mengambil data:", error);
        setError(error.message); // Simpan pesan error
        setLoading(false); // Set loading menjadi false
      }
    };

    fetchData();
  }, []);

  // Ambil data bidang saat komponen di-mount
  useEffect(() => {
    const fetchBidangData = async () => {
      try {
        const response = await getAllBidang(); // Panggil fungsi getAllBidang
        // Pastikan respons API memiliki struktur yang diharapkan
        if (response.bidang && Array.isArray(response.bidang)) {
          setBidangData(response.bidang); // Simpan data bidang ke state
        } else {
          console.error("Data bidang tidak valid:", response);
          setError("Data bidang tidak valid");
        }
      } catch (error) {
        console.error("Gagal mengambil data bidang:", error);
        setError(error.message); // Simpan pesan error
      }
    };

    fetchBidangData();
  }, []);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await getAllUsers(); // Panggil fungsi getAllUsers
        setUsers(response.data); // Simpan data pengguna ke state
      } catch (error) {
        console.error("Gagal mengambil data pengguna:", error);
        setError(error.message); // Simpan pesan error
      }
    };

    fetchUsers();
  }, []);

  // Fungsi untuk menambahkan bidang baru
  const handleCreateBidang = async () => {
    if (newBidang.trim() === "") {
      toast.error("Nama bidang tidak boleh kosong"); // Notifikasi error
      return;
    }

    try {
      const data = { name: newBidang }; // Data dalam format JSON
      // console.log("Data yang dikirim:", data); // Debugging

      const response = await createBidang(data); // Kirim data JSON ke API
      // console.log("Respons dari API:", response); // Debugging

      // Tambahkan bidang baru ke state
      setBidangData([...bidangData, { name: newBidang }]);
      setNewBidang(""); // Reset input

      toast.success(response.message); // Notifikasi sukses
    } catch (error) {
      console.error("Gagal membuat bidang:", error);
      toast.error("Gagal membuat bidang: " + error.message); // Notifikasi error
    }
  };

  // Fungsi untuk menghapus bidang
  const handleDeleteBidang = async (bidangId) => {
    // Tampilkan konfirmasi penghapusan
    const result = await Swal.fire({
      title: "Apakah Anda yakin?",
      text: "Anda tidak dapat mengembalikan data ini!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Ya, hapus!",
      cancelButtonText: "Batal",
    });

    // Jika pengguna mengonfirmasi penghapusan
    if (result.isConfirmed) {
      try {
        const response = await deleteBidang(bidangId); // Panggil fungsi untuk menghapus bidang

        // Perbarui state dengan menghapus bidang yang dihapus
        setBidangData(bidangData.filter((bidang) => bidang._id !== bidangId));

        toast.success(response.message); // Notifikasi sukses
      } catch (error) {
        console.error("Gagal menghapus bidang:", error);
        toast.error("Gagal menghapus bidang: " + error.message); // Notifikasi error
      }
    }
  };

  // Tampilkan loading state
  if (loading) {
    return (
      <div className="h-full fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 items-center justify-center bg-black bg-opacity-50 w-full flex">
        <HashLoader color="#C0392B" size={50} />
      </div>
    );
  }

  // Tampilkan error state
  if (error) {
    return (
      <div className="bg-gray-100 h-screen p-8">
        <h1 className="text-2xl font-bold">Terjadi Kesalahan</h1>
        <p className="text-red-500">{error}</p>
      </div>
    );
  }

  return (
    <div className="h-screen p-5">
      <Toaster /> {/* Tambahkan Toaster di sini */}
      <h1 className="text-2xl font-medium mb-4">Dashboard</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <div className="border border-gray-300 bg-white  p-5 lg:p-5">
          <h2 className="text-xl font-semibold mb-4">Data</h2>
          <p className="text-lg">
            Jumlah Data: <span className="font-bold">{data.length}</span>
          </p>
        </div>
        <div className="border border-gray-300 bg-white  p-5 lg:p-5">
          <h2 className="text-xl font-semibold mb-4">Bidang</h2>
          <p className="text-lg">
            Jumlah Bidang:{" "}
            <span className="font-bold">{bidangData.length}</span>
          </p>
        </div>
        <div className="border border-gray-300 bg-white  p-5 lg:p-5">
          <h2 className="text-xl font-semibold mb-4">Pengguna</h2>
          <p className="text-lg">
            Jumlah Pengguna: <span className="font-bold">{users.length}</span>
          </p>
        </div>
      </div>
      {/* Tabel untuk menampilkan dan membuat bidang */}
      <div>
        <h2 className="text-xl font-semibold mb-4">Manajemen Bidang</h2>
        <div className="mb-4">
          <input
            type="text"
            value={newBidang}
            onChange={(e) => setNewBidang(e.target.value)}
            placeholder="Masukkan nama bidang baru"
            className="border border-gray-300 p-2 w-56 rounded text-sm mr-2"
          />
          <button
            onClick={handleCreateBidang}
            className="bg-primary text-white p-2 text-sm rounded hover:bg-secondary"
          >
            Tambah Bidang
          </button>
        </div>
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-gray-200">
              <th className="border border-gray-300 p-2">No</th>
              <th className="border border-gray-300 p-2">Nama Bidang</th>
              <th className="border border-gray-300 p-2">Aksi</th>
            </tr>
          </thead>
          <tbody>
            {bidangData && bidangData.length > 0 ? (
              bidangData.map((bidang, index) => (
                <tr key={index} className="hover:bg-gray-100">
                  <td className="border border-gray-300 p-2 text-center">
                    {index + 1}
                  </td>
                  <td className="border border-gray-300 p-2">{bidang.name}</td>
                  <td className="border border-gray-300 p-2 text-center">
                    <button
                      onClick={() => handleDeleteBidang(bidang._id)}
                      className="bg-primary text-white p-2 text-sm rounded hover:bg-secondary"
                    >
                      Hapus
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="3" className="text-center p-2">
                  Tidak ada data bidang
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Dashboard;
