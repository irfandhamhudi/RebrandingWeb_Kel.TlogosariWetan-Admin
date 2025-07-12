import { useState } from "react";
import { CloudUpload } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { uploadPhoto } from "../../utils/data/PhotoAPI"; // Menggunakan uploadPhoto
import HashLoader from "react-spinners/HashLoader";
import toast from "react-hot-toast";

const AddGaleri = () => {
  const navigate = useNavigate();
  const [newImages, setNewImages] = useState([]);
  const [title, setTitle] = useState("");
  const [loading, setLoading] = useState(false);

  // Handler untuk upload file
  const handleFileUpload = (event) => {
    const files = Array.from(event.target.files);
    // Validasi format file (opsional)
    const allowedFormats = ["image/jpeg", "image/png", "image/gif"];
    const validFiles = files.filter((file) =>
      allowedFormats.includes(file.type)
    );
    if (validFiles.length !== files.length) {
      toast.error("Hanya file JPEG, PNG, atau GIF yang diperbolehkan.");
    }
    setNewImages((prev) => [...prev, ...validFiles]);
  };

  // Handler untuk menghapus gambar
  const removeImage = (index) => {
    setNewImages((prev) => prev.filter((_, i) => i !== index));
  };

  // Handler untuk submit form
  const handleSubmit = async (event) => {
    event.preventDefault();

    setLoading(true);

    // Validasi title dan images
    if (!title) {
      toast.error("Judul wajib diisi.");
      setLoading(false);
      return;
    }
    if (newImages.length === 0) {
      toast.error("Minimal satu gambar harus diunggah.");
      setLoading(false);
      return;
    }

    // Membuat FormData
    const formData = new FormData();
    formData.append("title", title);
    newImages.forEach((file) => {
      formData.append("images", file); // Nama field harus sesuai dengan backend
    });

    try {
      const response = await uploadPhoto(formData); // Menggunakan uploadPhoto
      if (response.success) {
        toast.success(response.message);
        navigate("/galeri");
      } else {
        toast.error(response.message);
      }
    } catch (error) {
      console.error("Error uploading photo:", error);
      toast.error("Gagal mengunggah foto. Silakan coba lagi.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen p-4 sm:p-5 relative">
      {loading && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-[9999]">
          <HashLoader color="#C0392B" size={50} />
        </div>
      )}

      <div className="mb-6 sm:mb-8">
        <h1 className="text-xl sm:text-2xl font-medium text-font1">
          Tambah Galeri
        </h1>
        <p className="text-sm sm:text-base text-font3 mt-1">
          Tambahkan foto terbaru untuk galeri
        </p>
      </div>

      <form onSubmit={handleSubmit}>
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
                    onChange={(e) => setTitle(e.target.value)}
                    className="w-full py-1.5 px-2 border border-borderPrimary rounded text-sm"
                    required
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
                <label className="flex flex-col items-center justify-center w-full h-24 sm:h-32 border-2 border-dashed border-borderPrimary rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100">
                  <CloudUpload size={20} color="gray" />
                  <span className="text-font3 text-sm mt-1">
                    Klik untuk Unggah
                  </span>
                  <input
                    type="file"
                    className="hidden"
                    accept="image/*"
                    onChange={handleFileUpload}
                    multiple
                  />
                </label>
                <div className="flex gap-3 sm:gap-4 overflow-x-auto">
                  {newImages.map((file, index) => (
                    <div
                      key={`new-${index}`}
                      className="relative flex-shrink-0"
                    >
                      <img
                        src={URL.createObjectURL(file)}
                        alt={`Uploaded ${index}`}
                        className="w-20 h-20 sm:w-28 sm:h-28 object-cover rounded border border-borderPrimary"
                      />
                      <button
                        type="button"
                        onClick={() => removeImage(index)}
                        className="absolute top-1 right-1 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm hover:bg-red-600"
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Submit Buttons */}
            <div className="flex flex-col sm:flex-row justify-end gap-2 sm:gap-3">
              <button
                type="button"
                onClick={() => navigate("/galeri")}
                className="text-sm bg-font3 text-white py-2 px-4 rounded-md w-full sm:w-auto"
              >
                Kembali
              </button>
              <button
                type="submit"
                className="text-sm bg-three text-white py-2 px-4 rounded-md w-full sm:w-auto"
                disabled={loading}
              >
                {loading ? "Loading..." : "Tambah Foto"}
              </button>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};

export default AddGaleri;
