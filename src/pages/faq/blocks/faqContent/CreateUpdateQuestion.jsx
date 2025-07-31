import React, { useState, useEffect } from "react";
import { Select } from "../../../../components/select/select";
import { useNavigate, useParams, useLocation } from "react-router";
import axiosInstance from "@/axiosConfig";
import { deleteFaq } from "./FaqData";
import { BASE_URL } from "../../../../static";
import { InputField } from "../../../../components/inputField/inputField";
import { toast, Bounce } from "react-toastify";
import { Input } from "antd";
const { TextArea } = Input;
import MarkdownIt from 'markdown-it';
import MdEditor from 'react-markdown-editor-lite';
import 'react-markdown-editor-lite/lib/index.css';

const mdParser = new MarkdownIt();

export const CreateUpdateQuestion = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();

  const [formData, setFormData] = useState({
    question: "",
    answer: "",
    status: "active",
  });

  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({
    question: false,
    answer: false,
  });

  const faqItem = location.state?.faqItem;

  useEffect(() => {
    if (faqItem) {
      setFormData({
        question: faqItem.question,
        answer: faqItem.answer,
        status: faqItem.status,
      });
    } else if (id) {
      axiosInstance.get(`/faq/${id}`)
        .then((res) => {
          const { question, answer, status } = res.data;
          setFormData({ question, answer, status });
        })
        .catch((err) => console.error("Ошибка загрузки вопроса", err));
    }
  }, [id, faqItem]);

  const handleChange = (field) => (e) => {
    const value = e.target ? e.target.value : e;
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleEditorChange = ({ text }) => {
    setFormData(prev => ({...prev, answer: text}));
  };

  const showAlert = (type, message) => {
    toast[type](message, {
      position: "top-center",
      autoClose: 3000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: "light",
      transition: Bounce,
    });
  };

  const validateForm = () => {
    const newErrors = {
      question: !formData.question,
      answer: !formData.answer,
    };

    setErrors(newErrors);
    return !Object.values(newErrors).some(Boolean);
  };

  const handleSave = async () => {
    if (!validateForm()) return;

    setLoading(true);
    try {
      const method = id ? "patch" : "post";
      const url = id ? `/faq/${id}` : `/faq/`;

      await axiosInstance({ method, url, data: formData });
      navigate("/faq");
    } catch (e) {
      console.error("Ошибка при сохранении:", e);
      showAlert("error", "Ошибка при сохранении");
    } finally {
      setLoading(false);
    }
  };

  const handleSaveAndAddMore = async () => {
    if (!validateForm()) return;

    setLoading(true);
    try {
      const method = id ? "patch" : "post";
      const url = id ? `/faq/${id}` : `/faq/`;

      await axiosInstance({ method, url, data: formData });
      setFormData({ question: "", answer: "", status: "active" });
      navigate("/faq/create-update-question");
    } catch (e) {
      console.error("Ошибка при сохранении:", e);
      showAlert("error", "Ошибка при сохранении");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (faqId) => {
    try {
      await deleteFaq(faqId);
      navigate("/faq");
    } catch (error) {
      console.error("Не удалось удалить вопрос", error);
      showAlert("error", "Не удалось удалить вопрос");
    }
  };

  return (
    <div className="px-6">
      <div className="text-2xl lg:text-3xl font-bold leading-none text-gray-900 pb-4">
        Создание / редактирование вопроса
      </div>
      <div className="card card-grid h-full min-w-full pb-4">
        <div className="card-header">
          <h3 className="card-title">Вопрос</h3>
        </div>
        <div className="min-[1024px]:flex px-4 gap-4 mt-4">
          <div className="w-full flex flex-col gap-4">
            <InputField
              text="Вопрос"
              value={formData.question}
              onChange={handleChange("question")}
              className="input"
              isInvalid={errors.question}
            />

            <div className="relative">
              <label
                style={{
                  color: "#99A1B7",
                  fontSize: "11px",
                  marginBottom: "0px",
                }}
                className="absolute top-[-10px] px-1 left-2 z-10 text-sm font-medium text-gray-900
             before:content-[''] before:absolute before:top-1/2 before:left-0
             before:w-full before:h-1/2 before:bg-[#FCFCFC] before:z-[-1]"
              >
                Ответ
              </label>
              <MdEditor
                value={formData.answer}
                style={{ height: "382px" }}
                renderHTML={(text) => mdParser.render(text)}
                onChange={handleEditorChange}
              />
            </div>

            <Select
              isStatus={true}
              text="Статус"
              value={formData.status}
              onChange={handleChange("status")}
              options={[
                { label: "Активен", value: "active" },
                { label: "Отключен", value: "inactive" },
              ]}
            />
          </div>
        </div>
      </div>
      <div className="lg:flex-row flex flex-col gap-4 pt-4 justify-between">
          <button
            className="lg:w-1/4 py-2 flex justify-center btn btn-outline btn-danger"
            onClick={() => handleDelete(id)}
          >
            Удалить
          </button>
        <button
          className="lg:w-1/4 flex justify-center btn btn-outline btn-primary"
          onClick={() => navigate("/faq")}
        >
          Отмена
        </button>
        <button
          className="lg:w-1/4 flex justify-center btn btn-outline btn-primary"
          onClick={handleSaveAndAddMore}
        >
          Сохранить и добавить еще
        </button>
        <button
          className="lg:w-1/4 flex justify-center btn btn-primary"
          onClick={handleSave}
          disabled={loading}
        >
          Сохранить
        </button>
      </div>
    </div>
  );
};