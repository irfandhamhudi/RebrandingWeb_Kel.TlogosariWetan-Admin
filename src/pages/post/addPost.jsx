import { useState, useEffect } from "react";
import { CloudUpload } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { createData } from "../../utils/data/dataNewsAPI";
import { getAllBidang } from "../../utils/data/bidangAPI";
import HashLoader from "react-spinners/HashLoader";
import toast from "react-hot-toast";

const AddPost = () => {
  const navigate = useNavigate();
  const [existingImages, setExistingImages] = useState([]);
  const [newImages, setNewImages] = useState([]);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [bidang, setBidang] = useState("");
  const [bidangList, setBidangList] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchBidang = async () => {
      try {
        const response = await getAllBidang();
        setBidangList(response.bidang);
      } catch (error) {
        console.error("Error fetching bidang:", error);
      }
    };

    fetchBidang();
  }, []);

  const handleFileUpload = (event) => {
    const files = Array.from(event.target.files);
    setNewImages((prev) => [...prev, ...files]);
  };

  const removeImage = (index, isExisting) => {
    if (isExisting) {
      setExistingImages((prev) => prev.filter((_, i) => i !== index));
    } else {
      setNewImages((prev) => prev.filter((_, i) => i !== index));
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    setLoading(true);

    if (!title || !description || !date || !time || !bidang) {
      alert(
        "All fields (title, description, date, time, bidang) are required."
      );
      setLoading(false); // Matikan loading jika validasi gagal
      return;
    }

    // Ubah format tanggal dari yyyy-mm-dd ke dd/mm/yyyy
    const formattedDate = date.split("-").reverse().join("/");

    const formData = new FormData();
    formData.append("title", title);
    formData.append("description", description);
    formData.append("date", formattedDate);
    formData.append("time", time);
    formData.append("bidang", bidang);

    newImages.forEach((file) => {
      formData.append("images", file);
    });

    try {
      const response = await createData(formData);
      if (response.success) {
        toast.success(response.message);
        navigate("/post");
      } else {
        toast.error(response.message);
      }
    } catch (error) {
      console.error("Error creating data:", error);
      toast.error(error.message);
    } finally {
      setLoading(false); // Matikan loading setelah proses selesai
    }
  };

  return (
    <div className="p-5 min-h-screen relative">
      {/* Overlay dan HashLoader */}
      {loading && (
        <div className="h-full fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 items-center justify-center bg-black bg-opacity-50 w-full flex z-50">
          <HashLoader color="#C0392B" size={50} />
        </div>
      )}

      <div className="mb-10">
        <h1 className="text-2xl font-medium text-font1">Tambah Postingan</h1>
        <p className="text-font3">Tambahkan informasi terbaru dari instansi</p>
      </div>
      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-2 gap-6">
          {/* Kolom Kiri */}
          <div className="space-y-4">
            {/* Name and Description */}
            <div className="border border-borderPrimary bg-white w-full h-max rounded-md shadow-sm">
              <div className="text-lg font-semibold p-5">
                <h1>Nama dan Deskripsi</h1>
              </div>
              <div className="border-b border-borderPrimary"></div>
              <div className="p-5">
                <div className="space-y-2">
                  <label className="text-sm text-font2" htmlFor="productName">
                    Title
                  </label>
                  <input
                    type="text"
                    id="productName"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="w-full mb-3 py-1.5 px-2 border border-borderPrimary rounded text-sm"
                    required
                  />
                </div>
                <div className="space-y-2 mt-5">
                  <label
                    className="text-sm text-font2"
                    htmlFor="productDescription"
                  >
                    Description
                  </label>
                  <textarea
                    id="productDescription"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className="w-full h-[200px] p-2 border border-borderPrimary rounded text-sm"
                    required
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Kolom Kanan */}
          <div className="space-y-4">
            <div className="border border-borderPrimary bg-white w-full h-max rounded-md shadow-sm">
              <div className="text-lg font-semibold p-5">
                <h1>Bidang</h1>
              </div>
              <div className="border-b border-borderPrimary"></div>
              <div className="p-5">
                <div className="space-y-2">
                  <label className="text-sm text-font2" htmlFor="productName">
                    Bidang
                  </label>
                  <select
                    id="bidang"
                    value={bidang}
                    onChange={(e) => setBidang(e.target.value)}
                    className="w-full mb-3 py-1.5 px-2 border border-borderPrimary rounded text-sm"
                    required
                  >
                    <option value="">-- Pilih Bidang --</option>
                    {bidangList.map((bidang) => (
                      <option key={bidang._id} value={bidang._id}>
                        {bidang.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            {/* Date Section */}
            <div className="border border-borderPrimary bg-white w-full h-max rounded-md shadow-sm">
              <div className="text-lg font-semibold p-5">
                <h1>Tanggal Posting</h1>
              </div>
              <div className="border-b border-borderPrimary"></div>
              <div className="p-5">
                <div className="space-y-2">
                  <label className="text-sm text-font2" htmlFor="date">
                    Tanggal
                  </label>
                  <input
                    type="text"
                    id="date"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    className="w-full mb-3 py-1.5 px-2 border border-borderPrimary rounded text-sm"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm text-font2" htmlFor="time">
                    Waktu
                  </label>
                  <input
                    type="time"
                    id="time"
                    value={time}
                    onChange={(e) => setTime(e.target.value)}
                    className="w-full mb-3 py-1.5 px-2 border border-borderPrimary rounded text-sm"
                    required
                  />
                </div>
              </div>
            </div>

            {/* Product Image Section */}
            <div className="border w-full border-borderPrimary bg-white rounded-md shadow-sm">
              <div className="text-lg font-semibold p-5">
                <h1>Gambar Postingan</h1>
              </div>
              <div className="border-b border-borderPrimary"></div>
              <div className="p-5 space-y-2">
                <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-borderPrimary rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100">
                  <CloudUpload size={20} color="gray" />
                  <span className="text-font3 text-sm">Click to Upload</span>
                  <input
                    type="file"
                    className="hidden"
                    accept="image/*"
                    onChange={handleFileUpload}
                    multiple
                  />
                </label>
                <div className="mt-5 flex gap-4 overflow-x-auto">
                  {/* Tampilkan gambar yang sudah ada */}
                  {existingImages.map((images, index) => (
                    <div key={`existing-${index}`} className="relative">
                      <img
                        src={images.url}
                        alt={`Existing ${index}`}
                        className="w-28 h-28 object-cover rounded border border-borderPrimary"
                      />
                      <button
                        type="button"
                        onClick={() => removeImage(index, true)}
                        className="absolute top-1 right-1 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm hover:bg-red-600"
                      >
                        &times;
                      </button>
                    </div>
                  ))}
                  {/* Tampilkan gambar baru yang diupload */}
                  {newImages.map((file, index) => (
                    <div key={`new-${index}`} className="relative">
                      <img
                        src={URL.createObjectURL(file)}
                        alt={`Uploaded ${index}`}
                        className="w-28 h-28 object-cover rounded border border-borderPrimary"
                      />
                      <button
                        type="button"
                        onClick={() => removeImage(index, false)}
                        className="absolute top-1 right-1 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm hover:bg-red-600"
                      >
                        &times;
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Submit Buttons */}
            <div className="flex justify-end gap-2">
              <button
                type="button"
                onClick={() => navigate("/post")}
                className="text-sm bg-font3 text-white  py-2 px-4 rounded-md"
              >
                Kembali
              </button>
              <button
                type="submit"
                className="text-sm bg-three text-white  py-2 px-4 rounded-md"
                disabled={loading} // Nonaktifkan tombol saat loading
              >
                {loading ? "Loading..." : "Tambah Berita"}
              </button>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};

export default AddPost;
