import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getPhotoById, deletePhoto } from "../../utils/data/PhotoAPI";
// import { CloudUpload } from "lucide-react";
import toast from "react-hot-toast";
import HashLoader from "react-spinners/HashLoader";
import Swal from "sweetalert2";

const GaleriID = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [title, setTitle] = useState("");
  const [existingImages, setExistingImages] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // Mengambil data foto berdasarkan ID
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await getPhotoById(id);
        setTitle(response.title);
        setExistingImages(response.images || []);
        setIsLoading(false);
      } catch (error) {
        console.error("Failed to fetch photo:", error);
        toast.error("Gagal memuat data galeri");
        setIsLoading(false);
      }
    };

    fetchData();
  }, [id]);

  // Handler untuk menghapus foto
  const handleDelete = async () => {
    const result = await Swal.fire({
      title: "Apakah Anda yakin?",
      text: "Foto ini akan dihapus dan tidak dapat dikembalikan!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Ya, hapus!",
      cancelButtonText: "Batal",
    });

    if (result.isConfirmed) {
      try {
        const response = await deletePhoto(id);
        toast.success(response.message);
        navigate("/galeri");
      } catch (error) {
        console.error("Failed to delete photo:", error);
        toast.error(error.message || "Gagal menghapus foto");
      }
    }
  };

  if (isLoading) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-[9999]">
        <HashLoader color="#C0392B" size={50} />
      </div>
    );
  }

  return (
    <div className="min-h-screen p-4 sm:p-5">
      <div className="mb-6 sm:mb-8">
        <h1 className="text-xl sm:text-2xl font-medium text-font1">
          Detail Galeri
        </h1>
        <p className="text-sm sm:text-base text-font3 mt-1">
          Detail foto dari galeri
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
        {/* Kolom Kiri: Title */}
        <div className="space-y-3 sm:space-y-4">
          <div className="border border-borderPrimary bg-white w-full rounded">
            <div className="text-base sm:text-lg font-semibold p-4 sm:p-5">
              <h1>Judul</h1>
            </div>
            <div className="border-b border-borderPrimary"></div>
            <div className="p-4 sm:p-5 space-y-3 sm:space-y-4">
              <div className="space-y-2">
                <label className="text-sm text-font2" htmlFor="title">
                  Judul
                </label>
                <input
                  type="text"
                  id="title"
                  value={title}
                  readOnly
                  className="w-full py-1.5 px-2 border border-borderPrimary rounded text-sm bg-gray-100"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Kolom Kanan: Images */}
        <div className="space-y-3 sm:space-y-4">
          <div className="border border-borderPrimary bg-white w-full rounded">
            <div className="text-base sm:text-lg font-semibold p-4 sm:p-5">
              <h1>Gambar Galeri</h1>
            </div>
            <div className="border-b border-borderPrimary"></div>
            <div className="p-4 sm:p-5 space-y-3 sm:space-y-4">
              <div className="flex gap-3 sm:gap-4 overflow-x-auto">
                {existingImages.length > 0 ? (
                  existingImages.map((file, index) => (
                    <div
                      key={`existing-${index}`}
                      className="relative flex-shrink-0"
                    >
                      <img
                        src={file}
                        alt={`Image ${index}`}
                        className="w-20 h-20 sm:w-28 sm:h-28 object-cover rounded border border-borderPrimary"
                      />
                    </div>
                  ))
                ) : (
                  <p className="text-sm text-gray-600">
                    Tidak ada gambar tersedia.
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Tombol Aksi */}
          <div className="flex flex-col sm:flex-row justify-end gap-2 sm:gap-3">
            <button
              type="button"
              onClick={() => navigate("/galeri")}
              className="text-sm bg-font3 text-white py-2 px-4 rounded-md w-full sm:w-auto"
            >
              Kembali
            </button>
            <button
              type="button"
              onClick={handleDelete}
              className="text-sm bg-primary text-white py-2 px-4 rounded-md w-full sm:w-auto"
            >
              Hapus Foto
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GaleriID;
