import { useState, useEffect } from "react";
import toast from "react-hot-toast"; // Import react-hot-toast
import { HashLoader } from "react-spinners"; // Import HashLoader
import Swal from "sweetalert2"; // Import SweetAlert2
import error404 from "../../assets/error404.png";
import {
  getAllSlider,
  deleteSlider,
  updateSlider,
  createSlider,
} from "../../utils/data/sliderAPI";

const Slider = () => {
  const [sliders, setSliders] = useState([]);
  const [loading, setLoading] = useState(false); // State untuk loading

  // Ambil data slider saat komponen di-mount
  useEffect(() => {
    const fetchSliders = async () => {
      try {
        const response = await getAllSlider(); // Panggil fungsi getAllSlider
        setSliders(response.data); // Set state sliders dengan data lengkap
      } catch (error) {
        console.error("Gagal mengambil data slider:", error);
        toast.error("Gagal mengambil data slider."); // Notifikasi error
      }
    };

    fetchSliders();
  }, []);

  // Handle upload gambar baru
  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (file) {
      const formData = new FormData();
      formData.append("images", file); // Sesuaikan dengan key yang diharapkan oleh backend

      setLoading(true); // Set loading true saat upload dimulai
      try {
        const response = await createSlider(formData); // Kirim gambar ke backend
        setSliders((prevSliders) => [...prevSliders, response.data]); // Tambahkan gambar ke state
        toast.success(response.message); // Notifikasi sukses
      } catch (error) {
        console.error("Gagal mengupload slider:", error);
        toast.error(error.message); // Notifikasi error
      } finally {
        setLoading(false); // Set loading false setelah proses selesai
      }
    }
  };

  // Handle edit gambar
  const handleEditSlider = async (index) => {
    const fileInput = document.createElement("input");
    fileInput.type = "file";
    fileInput.accept = "image/*";
    fileInput.multiple = true; // Izinkan multiple file
    fileInput.onchange = async (e) => {
      const files = e.target.files;
      if (files && files.length > 0) {
        const formData = new FormData();
        for (let i = 0; i < files.length; i++) {
          formData.append("images", files[i]); // Tambahkan semua file ke FormData
        }

        setLoading(true); // Set loading true saat edit dimulai
        try {
          // Ambil id slider dari state sliders
          const sliderId = sliders[index]._id;

          // Kirim id dan formData ke backend
          const response = await updateSlider(sliderId, formData);

          // Perbarui state sliders dengan data yang baru
          setSliders((prevSliders) =>
            prevSliders.map((slider, i) =>
              i === index
                ? { ...slider, images: response.data.images } // Update semua gambar
                : slider
            )
          );

          toast.success(response.message); // Notifikasi sukses
        } catch (error) {
          console.error("Gagal memperbarui slider:", error);
          toast.error(error.message); // Notifikasi error
        } finally {
          setLoading(false); // Set loading false setelah proses selesai
        }
      }
    };
    fileInput.click();
  };

  // Handle hapus gambar
  const handleDeleteSlider = async (index) => {
    // Konfirmasi hapus dengan SweetAlert2
    const result = await Swal.fire({
      title: "Apakah Anda yakin?",
      text: "Slider yang dihapus tidak dapat dikembalikan!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Ya, hapus!",
      cancelButtonText: "Batal",
    });

    if (result.isConfirmed) {
      setLoading(true); // Set loading true saat hapus dimulai
      try {
        // Ambil id slider dari state sliders
        const sliderId = sliders[index]._id;

        // Hapus slider dari backend
        const response = await deleteSlider(sliderId);

        // Hapus slider dari state
        setSliders((prevSliders) => prevSliders.filter((_, i) => i !== index));

        toast.success(response.message); // Notifikasi sukses
      } catch (error) {
        console.error("Gagal menghapus slider:", error);
        toast.error(error.message); // Notifikasi error
      } finally {
        setLoading(false); // Set loading false setelah proses selesai
      }
    }
  };

  return (
    <div className="min-h-screen p-5 relative">
      {/* Loading Spinner */}
      {loading && (
        <div className="h-full fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 items-center justify-center bg-black bg-opacity-50 w-full flex z-50">
          <HashLoader color="#C0392B" size={50} />
        </div>
      )}

      <div className="flex justify-between items-center mb-8">
        <div className="space-y-2">
          <h1 className="text-2xl font-medium">Slider</h1>
          <p className="text-font3">Pilih gambar untuk diupload</p>
        </div>
        <div>
          <input
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="hidden"
            id="slider-upload"
            disabled={loading} // Nonaktifkan input saat loading
          />
          <label
            htmlFor="slider-upload"
            className={`flex items-center text-sm bg-primary text-white hover:bg-secondary hover:text-white py-2 px-4 rounded-md cursor-pointer ${
              loading ? "opacity-50 cursor-not-allowed" : ""
            }`}
          >
            {loading ? "Uploading..." : "Upload Slider"}
          </label>
        </div>
      </div>

      {/* Preview Gambar dalam Layout Horizontal */}
      <div className="flex overflow-x-auto w-full gap-4 pb-4">
        {sliders.map((slider, index) => {
          // Ambil URL gambar pertama dari array images
          const imageUrl = slider.images[0];

          return (
            <div key={slider._id} className="flex-shrink-0 relative group">
              <img
                src={imageUrl}
                alt={`Slider ${index + 1}`}
                className="w-full h-96 object-cover"
                onError={(e) => {
                  console.error("Gagal memuat gambar:", imageUrl);
                  e.target.src = { error404 }; // Fallback image
                }}
              />
              {/* Tombol Edit dan Hapus */}
              <div className="absolute inset-0 bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                <button
                  onClick={() => handleEditSlider(index)}
                  className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600 text-sm"
                  disabled={loading} // Nonaktifkan tombol saat loading
                >
                  {loading ? "Editing..." : "Edit"}
                </button>
                <button
                  onClick={() => handleDeleteSlider(index)}
                  className="bg-primary text-white px-3 py-1 rounded hover:bg-secondary text-sm"
                  disabled={loading} // Nonaktifkan tombol saat loading
                >
                  Hapus
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Slider;
