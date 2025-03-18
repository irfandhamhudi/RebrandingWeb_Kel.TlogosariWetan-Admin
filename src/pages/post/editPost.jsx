import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { CloudUpload } from "lucide-react";
import {
  getDataById,
  updateData,
  deleteData,
} from "../../utils/data/dataNewsAPI";
import { getAllBidang } from "../../utils/data/bidangAPI";
import toast from "react-hot-toast";
import HashLoader from "react-spinners/HashLoader";
import Swal from "sweetalert2";

const EditProduct = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [existingImages, setExistingImages] = useState([]);
  const [newImages, setNewImages] = useState([]);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [selectedField, setSelectedField] = useState("");
  const [postDate, setPostDate] = useState("");
  const [postTime, setPostTime] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isUpdating, setIsUpdating] = useState(false);
  const [bidangList, setBidangList] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getDataById(id);
        setTitle(data.title);
        setDescription(data.description);
        setSelectedField(data.bidang._id);
        setPostDate(data.date);
        setPostTime(data.time);
        setExistingImages(data.images || []);
        setIsLoading(false);
      } catch (error) {
        console.error("Failed to fetch data:", error);
        setIsLoading(false);
      }
    };

    fetchData();
  }, [id]);

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

    setIsUpdating(true);

    const formData = new FormData();
    formData.append("title", title);
    formData.append("description", description);
    formData.append("bidang", selectedField);
    formData.append("date", postDate);
    formData.append("time", postTime);

    existingImages.forEach((image, index) => {
      formData.append(`existingImages[${index}]`, image);
    });

    newImages.forEach((image) => {
      formData.append(`images`, image);
    });

    try {
      const response = await updateData(id, formData);
      toast.success(response.message);
      navigate("/post");
    } catch (error) {
      console.error("Gagal memperbarui data:", error);
      toast.error(error.message);
    } finally {
      setIsUpdating(false);
    }
  };

  const handleDelete = async () => {
    const result = await Swal.fire({
      title: "Apakah Anda yakin?",
      text: "Anda tidak dapat mengembalikan data ini setelah dihapus!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Ya, hapus!",
      cancelButtonText: "Batal",
    });

    if (result.isConfirmed) {
      try {
        const response = await deleteData(id);
        toast.success(response.message);
        navigate("/post");
      } catch (error) {
        console.error("Gagal menghapus data:", error);
        toast.error(error.message);
      }
    }
  };

  if (isLoading) {
    return (
      <div className="h-full fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 items-center justify-center bg-black bg-opacity-50 w-full flex">
        <HashLoader color="#C0392B" size={50} />
      </div>
    );
  }

  return (
    <div className="p-5 min-h-screen">
      {isUpdating && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <HashLoader color="#C0392B" size={50} />
        </div>
      )}

      <div className="mb-10">
        <h1 className="text-2xl font-medium text-font1">Edit Postingan</h1>
        <p className="text-font3">Edit informasi terbaru dari instansi</p>
      </div>
      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-2 gap-6">
          {/* Kolom Kiri */}
          <div className="space-y-4">
            <div className="border border-borderPrimary bg-white w-full h-max rounded-md shadow-sm">
              <div className="text-lg font-semibold p-5">
                <h1>Nama dan Deskripsi</h1>
              </div>
              <div className="border-b border-borderPrimary"></div>
              <div className="p-5">
                <div className="space-y-2">
                  <label className="text-sm text-font2" htmlFor="title">
                    Title
                  </label>
                  <input
                    type="text"
                    id="title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="w-full mb-3 py-1.5 px-2 border border-borderPrimary rounded text-sm"
                    required
                  />
                </div>
                <div className="space-y-2 mt-5">
                  <label className="text-sm text-font2" htmlFor="description">
                    Description
                  </label>
                  <textarea
                    id="description"
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
                    Title
                  </label>
                  <select
                    className="w-full mb-3 py-1.5 px-2 border border-borderPrimary rounded text-sm"
                    value={selectedField}
                    onChange={(e) => setSelectedField(e.target.value)}
                    required
                  >
                    <option value="">Pilih Bidang</option>
                    {bidangList.map((bidang) => (
                      <option key={bidang._id} value={bidang._id}>
                        {bidang.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            {/* Date and Time Section */}
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
                    value={postDate}
                    onChange={(e) => setPostDate(e.target.value)}
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
                    value={postTime}
                    onChange={(e) => setPostTime(e.target.value)}
                    className="w-full mb-3 py-1.5 px-2 border border-borderPrimary rounded text-sm"
                    required
                  />
                </div>
              </div>
            </div>

            {/* Gambar */}
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
                  {existingImages.map((file, index) => (
                    <div key={`existing-${index}`} className="relative">
                      <img
                        src={file}
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
                Cancel
              </button>
              <button
                type="button"
                onClick={handleDelete}
                className="text-sm bg-primary text-white  py-2 px-4 rounded-md"
              >
                Hapus Berita
              </button>
              <button
                type="submit"
                className="text-sm bg-three text-white  py-2 px-4 rounded-md"
              >
                Update Berita
              </button>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};

export default EditProduct;
