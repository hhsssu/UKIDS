import loading from "@/assets/loading.gif"
import loading2 from "@/assets/loading2.gif"
import "@/components/feature/loading/loading.css"

export const Loading = () => {
    return (
        <div className="loading-overlay">
            <div className="loading-content">
                <h1 className="text-{150} text-white">사진 업로드 중!</h1>
                <img className="imgSize" src={loading} alt="로딩" />
            </div>
        </div>
    );
}