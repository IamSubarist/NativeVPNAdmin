import React, { useState, useEffect } from "react";
import { Select } from "../../../../components/select/select";
import { useNavigate, useParams, useLocation } from "react-router";
import axiosInstance from "@/axiosConfig";
import { deleteDocumentation } from "./DocumentationData";
import { InputField } from "../../../../components/inputField/inputField";
import { toast, Bounce } from "react-toastify";
import MarkdownIt from 'markdown-it';
import MdEditor from 'react-markdown-editor-lite';
import 'react-markdown-editor-lite/lib/index.css';

const mdParser = new MarkdownIt();

export const CreateUpdateDocumentation = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();

  const [formData, setFormData] = useState({
    name: "",
    text: "",
    status: "active",
  });

  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({
    name: false,
    text: false,
  });

  const documentationItem = location.state?.documentationItem;

  useEffect(() => {
    if (documentationItem) {
      setFormData({
        name: documentationItem.name,
        text: documentationItem.text,
        status: documentationItem.status,
      });
    } else if (id) {
      axiosInstance.get(`/docs_rules/${id}`)
        .then((res) => {
          const { name, text, status } = res.data;
          setFormData({ name, text, status });
        })
        .catch((err) => {
          console.error("Ошибка загрузки документа", err);
          showAlert("error", "Не удалось загрузить документ");
        });
    }
  }, [id, documentationItem]);

  const handleChange = (field) => (e) => {
    const value = e.target ? e.target.value : e;
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleEditorChange = ({ text }) => {
    setFormData(prev => ({...prev, text}));
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
      name: !formData.name,
      text: !formData.text,
    };

    setErrors(newErrors);
    return !Object.values(newErrors).some(Boolean);
  };

  const handleSave = async () => {
    if (!validateForm()) {
      showAlert("error", "Заполните обязательные поля");
      return;
    }

    setLoading(true);
    try {
      const method = id ? "patch" : "post";
      const url = id ? `/docs_rules/${id}` : `/docs_rules/`;

      await axiosInstance({ method, url, data: formData });
      showAlert("success", "Документ успешно сохранён");
      navigate("/documentation");
    } catch (e) {
      console.error("Ошибка при сохранении:", e);
      showAlert("error", "Ошибка при сохранении документа");
    } finally {
      setLoading(false);
    }
  };

  const handleSaveAndAddMore = async () => {
    if (!validateForm()) {
      showAlert("error", "Заполните обязательные поля");
      return;
    }

    setLoading(true);
    try {
      const method = id ? "patch" : "post";
      const url = id ? `/docs_rules/${id}` : `/docs_rules/`;

      await axiosInstance({ method, url, data: formData });
      showAlert("success", "Документ успешно сохранён");
      setFormData({
        name: "",
        text: "",
        status: "active",
      });
      navigate("/documentation/create-update-documentation");
    } catch (e) {
      console.error("Ошибка при сохранении:", e);
      showAlert("error", "Ошибка при сохранении документа");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (documentationId) => {
    try {
      await deleteDocumentation(documentationId);
      showAlert("success", "Документ успешно удалён");
      navigate("/documentation");
    } catch (error) {
      console.error("Не удалось удалить документ", error);
      showAlert("error", "Не удалось удалить документ");
    }
  };

  return (
    <div className="px-6">
      <div className="text-2xl lg:text-3xl font-bold leading-none text-gray-900 pb-4">
        Создание / редактирование документа
      </div>
      <div className="card card-grid h-full min-w-full pb-4">
        <div className="card-header">
          <h3 className="card-title">Документ</h3>
        </div>
        <div className="flex flex-col px-4 gap-4 mt-4">
          <InputField
            text="Название"
            value={formData.name}
            onChange={handleChange("name")}
            className="textarea textarea-bordered"
            isInvalid={errors.name}
          />

          <div className="relative">
            <label className="absolute top-[-10px] px-1 left-2 z-10 text-sm font-medium text-gray-900 before:content-[''] before:absolute before:top-1/2 before:left-0 before:w-full before:h-1/2 before:bg-[#FCFCFC] before:z-[-1]">
              Содержание
            </label>
            <MdEditor
              value={formData.text}
              style={{ height: "382px" }}
              renderHTML={(text) => mdParser.render(text)}
              onChange={handleEditorChange}
              status={errors.text ? "error" : ""}
            />
          </div>

          <Select
            isStatus={true}
            text="Статус"
            value={formData.status}
            onChange={handleChange("status")}
            options={[
              { label: "Активен", value: "active" },
              { label: "Остановлен", value: "inactive" },
            ]}
          />
        </div>
      </div>
      <div className="lg:flex-row flex flex-col gap-4 pt-4 justify-between">
        {id && (
          <button
            className="lg:w-1/4 py-2 flex justify-center btn btn-outline btn-danger"
            onClick={() => handleDelete(id)}
          >
            Удалить
          </button>
        )}
        <button
          className="lg:w-1/4 flex justify-center btn btn-outline btn-primary"
          onClick={() => navigate("/documentation")}
        >
          Отмена
        </button>
        <button
          className="lg:w-1/4 flex justify-center btn btn-outline btn-primary"
          onClick={handleSaveAndAddMore}
          disabled={loading}
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