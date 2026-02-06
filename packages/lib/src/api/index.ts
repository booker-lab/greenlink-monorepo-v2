import axios, { AxiosInstance } from "axios";

// API 클라이언트 생성
export const createApiClient = (baseURL: string): AxiosInstance => {
    const client = axios.create({
        baseURL,
        timeout: 10000,
        headers: {
            "Content-Type": "application/json",
        },
    });

    // 요청 인터셉터
    client.interceptors.request.use(
        (config) => {
            // 인증 토큰 추가 등
            const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;
            if (token) {
                config.headers.Authorization = `Bearer ${token}`;
            }
            return config;
        },
        (error) => Promise.reject(error)
    );

    // 응답 인터셉터
    client.interceptors.response.use(
        (response) => response,
        (error) => {
            // 에러 처리
            console.error("API Error:", error);
            return Promise.reject(error);
        }
    );

    return client;
};

// 기본 API 클라이언트
export const api = createApiClient(
    process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api"
);

// 상품 관련 API
export const productApi = {
    getAll: () => api.get("/products"),
    getById: (id: string) => api.get(`/products/${id}`),
    create: (data: FormData) => api.post("/products", data),
    update: (id: string, data: FormData) => api.put(`/products/${id}`, data),
    delete: (id: string) => api.delete(`/products/${id}`),
};

// 사용자 관련 API
export const userApi = {
    getProfile: () => api.get("/users/me"),
    updateProfile: (data: Record<string, unknown>) => api.put("/users/me", data),
    getFollowers: () => api.get("/users/me/followers"),
};
