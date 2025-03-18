import { Plus } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { getAllData } from "../../utils/data/dataNewsAPI";
import HashLoader from "react-spinners/HashLoader";

const truncateText = (text, length) => {
  return text.length > length ? text.substring(0, length) + "..." : text;
};

const Posts = () => {
  const navigate = useNavigate();
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchPosts = async () => {
    try {
      const response = await getAllData();
      if (Array.isArray(response.data)) {
        setPosts(response.data);
      } else {
        console.error("Expected an array but got:", response);
        setPosts([]);
      }
    } catch (error) {
      console.error("Error fetching posts:", error);
      setPosts([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setTimeout(() => {
      setLoading(false);
      fetchPosts();
    }, 1000);
    // fetchPosts(); // Panggil fungsi fetchPosts saat komponen dimount
  }, []);

  return (
    <div className="p-5 min-h-screen">
      <div className="space-y-2 mb-10">
        <div className="flex items-center justify-between">
          <div className="space-y-2">
            <h1 className="text-2xl font-medium text-font1">
              Berita & Pengumuman
            </h1>
            <p className="text-font3">Informasi terbaru dari instansi</p>
          </div>
          <button
            onClick={() => navigate("/add-post")}
            className="flex items-center text-sm bg-primary text-white hover:bg-secondary hover:text-white py-2 px-4 rounded-md"
          >
            <Plus size={18} className="cursor-pointer mr-2" />
            Tambah Berita
          </button>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-6">
        {loading ? (
          <div className="h-full fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 items-center justify-center bg-black bg-opacity-50 w-full flex">
            <HashLoader color="#C0392B" size={50} />
          </div>
        ) : (
          posts.map((post, index) => (
            <div
              key={index}
              className="border border-gray-300 bg-white p-5 lg:p-5 h-auto"
            >
              {/* Tampilkan gambar pertama jika ada */}
              <div className="grid grid-cols-1 gap-4">
                {post.images && post.images.length > 0 && (
                  <div className="relative h-72">
                    {" "}
                    {/* Container dengan tinggi tetap */}
                    <img
                      src={post.images[0]}
                      alt={post.title}
                      className="absolute inset-0 w-full h-full object-cover"
                    />
                  </div>
                )}
              </div>
              <div className="lg:justify-between flex flex-col lg:flex-row items-start space-y-2 lg:space-y-0 text-xs mt-5 mb-5">
                <p className="bg-red-100 text-primary py-1 px-2 ">
                  {post.bidang.name}
                </p>
                <p>
                  {post.date} - {post.time} WIB
                </p>
              </div>
              <h1
                onClick={() => navigate(`/edit-post/${post._id}`)}
                className="text-lg font-semibold hover:underline cursor-pointer"
              >
                {truncateText(post.title, 30)}
              </h1>
              <p className="text-sm text-gray-600 mt-2">
                {truncateText(post.description, 70)}
              </p>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Posts;
