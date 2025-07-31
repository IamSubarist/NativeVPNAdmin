import React, { useMemo, useState, useEffect, useContext } from "react";
import { DataGrid, KeenIcon } from "@/components";
import {
  getPromocodesData,
  deletePromocode,
  swapPromocodesPosition,
} from "./PromocodesData";
import { Link, useNavigate } from "react-router-dom";
import axiosInstance from "../../../axiosConfig";
import { PromocodesFilterTable } from "../PromocodesFilterTable";
import { PromocodesFilterContext } from "@/providers/PromocodesFilterProvider";
import { usePagination } from "@/providers/PaginationContext";

const statusLabels = {
  true: "Активно",
  false: "Остановлено",
};

const checkTypeLabels = {
  auto: "Автоматически",
  handle: "Ручной",
  timer: "Таймер",
  postback: "Постбэк",
};

export const PromocodesContent = () => {
  const navigate = useNavigate();
  const [giveawayNames, setGiveawayNames] = useState({});
  const [tasks, setTasks] = useState([]);
  const { activePage, setActivePage, setTotalPages, totalPages } =
    usePagination();
  const [size, setSize] = useState(10);
  const {
    filterOptions = {},
    newListTasks,
    updateTasksList,
  } = useContext(PromocodesFilterContext);
  const [refreshKey, setRefreshKey] = useState(0);

  const fetchPromocodes = async ({ pageIndex, pageSize, filters, sorting }) => {
    const sortingParams = sorting[0] || { id: null, desc: false };
    const params = {
      start: pageIndex,
      limit: pageSize,
      order_by: sortingParams.id || null,
      order_direction: sortingParams.desc ? "desc" : "asc",
      ...filters,
    };
    console.log(sortingParams, "sorting");

    const tasksData = await getPromocodesData({ params });

    setTotalPages(tasksData.total_pages);
    setSize(tasksData.limit || pageSize);
    setTasks(tasksData.items);

    // Сбор ID конкурсов
    const giveawayIds = tasksData.items
      .map((task) => task.giveaway_id)
      .filter(Boolean);

    // Загрузка названий конкурсов
    fetchGiveawayNames(giveawayIds);

    return {
      data: tasksData.items,
      totalCount: tasksData.total_items,
    };
  };

  const fetchGiveawayNames = async (giveawayIds) => {
    const newGiveawayNames = {};

    // Убираем дубликаты и фильтруем уже загруженные
    const uniqueIdsToFetch = giveawayIds.filter(
      (id) => id && !giveawayNames[id]
    );

    await Promise.all(
      uniqueIdsToFetch.map(async (id) => {
        try {
          const response = await axiosInstance.get(
            `https://vpnbot.sjp-asia.group/admin_panel/api/giveaways/${id}`
          );
          newGiveawayNames[id] = response.data.name;
        } catch (error) {
          console.error(
            `Ошибка при получении названия конкурса с ID ${id}:`,
            error
          );
          newGiveawayNames[id] = "Неизвестный конкурс";
        }
      })
    );

    // Объединяем с уже существующими
    setGiveawayNames((prev) => ({ ...prev, ...newGiveawayNames }));
  };

  const handleDelete = async (taskId) => {
    try {
      await deletePromocode(taskId);
      updateTasksList(filterOptions, activePage + 1);
      setRefreshCounter((prev) => prev + 1);
    } catch (error) {
      console.error("Не удалось удалить задание", error);
    }
  };

  // Добавляем обработчик смены позиции
  const handleSwap = async (index, direction, tasksData) => {
    const targetIndex = direction === "up" ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= tasksData.length) return;
    const firstId = tasksData[index].id;
    const secondId = tasksData[targetIndex].id;
    try {
      await swapPromocodesPosition(firstId, secondId);
      setRefreshKey((prev) => prev + 1);
    } catch (e) {
      console.error("Не удалось поменять позиции заданий", e);
    }
  };

  const columns = useMemo(
    () => [
      {
        accessorFn: (row) => row.task_id,
        id: "task_id",
        enableSorting: true,
        header: () => "ID",
        cell: (info) => <div>{info.row.original.id}</div>,
        meta: {
          className: "w-[70px]",
          cellClassName: "text-gray-800 font-normal",
        },
      },
      {
        accessorFn: (row) => row.created_at,
        id: "created_at",
        header: () => "Дата создания",
        cell: (info) => {
          const formattedDate = new Date(
            info.row.original.created_at
          ).toLocaleDateString("ru-RU");
          return <div className="min-w-[110px]">{formattedDate}</div>;
        },
        meta: {
          className: "w-1/6",
          cellClassName: "text-gray-800 font-normal",
        },
      },
      {
        accessorFn: (row) => row.title,
        id: "title",
        header: () => "Название",
        cell: (info) => {
          const { title, photo, giveaway_id } = info.row.original;
          const imageUrl =
            photo && (photo.startsWith("http") ? photo : `http://${photo}`);

          return (
            <div className="flex items-center gap-2 min-w-[300px]">
              {imageUrl && (
                <img
                  src={imageUrl}
                  alt={title}
                  className="w-10 h-10 object-contain rounded-full border border-[#DBDFE9]"
                />
              )}
              <div>{title}</div>
            </div>
          );
        },
        meta: {
          className: "w-1/6",
          cellClassName: "text-gray-800 font-normal",
        },
      },
      {
        accessorFn: (row) => row.code,
        id: "code",
        header: () => "Промокод",
        cell: (info) => <div>{info.row.original.code}</div>,
        meta: {
          className: "",
          cellClassName: "text-gray-800 font-normal",
        },
      },
      {
        accessorFn: (row) => row.discount_amount,
        id: "discount_amount",
        header: () => "Сумма бонуса",
        cell: (info) => <div>{info.row.original.discount_amount}</div>,
        meta: {
          className: "w-1/5",
          cellClassName: "text-gray-800 font-normal",
        },
      },
      {
        accessorFn: (row) => row.used_count,
        id: "used_count",
        header: () => "Активировано",
        cell: (info) => (
          <div className="min-w-[110px]">{info.row.original.used_count}</div>
        ),
        meta: {
          className: "w-1/6",
          cellClassName: "text-gray-800 font-normal",
        },
      },
      {
        accessorFn: (row) => row.check_type,
        id: "check_type",
        header: () => "Количество оплат",
        cell: (info) => (
          <div className="min-w-[110px]">
            {checkTypeLabels[info.row.original.check_type]}
          </div>
        ),
        meta: {
          className: "w-1/6",
          cellClassName: "text-gray-800 font-normal",
        },
      },
      {
        accessorFn: (row) => row.discount_amount2,
        id: "discount_amount2",
        header: () => "Сумма оплат",
        cell: (info) => (
          <div className="min-w-[110px]">
            {info.row.original.discount_amount2}
          </div>
        ),
        meta: {
          className: "w-1/6",
          cellClassName: "text-gray-800 font-normal",
        },
      },
      {
        accessorFn: (row) => row.is_active,
        id: "is_active",
        header: () => "Статус",
        enableSorting: true,
        cell: (info) => (
          <div className="min-w-[110px]">
            {info.row.original.is_active ? "Активен" : "Остановлен"}
          </div>
        ),
        meta: {
          className: "w-1/6",
          cellClassName: "text-gray-800 font-normal",
        },
      },
      {
        accessorFn: (row) => row.actions,
        id: "actions",
        header: () => "Действия",
        cell: (info) => {
          const taskId = info.row.original.id;
          const handleDownload = async () => {
            try {
              const response = await axios.get(
                `${BASE_URL}/tasks/participants/report/${taskId}`,
                {
                  responseType: "blob",
                  headers: {
                    Authorization: `Bearer ${localStorage.getItem("admin_token")}`,
                    Accept:
                      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
                  },
                }
              );
              const url = window.URL.createObjectURL(new Blob([response.data]));
              const link = document.createElement("a");
              link.href = url;
              link.setAttribute(
                "download",
                `participants_report_${taskId}.xlsx`
              );
              document.body.appendChild(link);
              link.click();
              link.remove();
              window.URL.revokeObjectURL(url);
            } catch (error) {
              console.error("Ошибка при скачивании файла:", error);
              alert("Не удалось скачать файл");
            }
          };

          return (
            <div className="flex gap-3 justify-center">
              <Link
                to={`/tasks/create-update-tasks/${info.row.original.id}`}
                state={{ taskItem: info.row.original }}
              >
                <button className="ki-filled text-2xl text-primary">
                  <KeenIcon icon={"setting-2"} />
                </button>
              </Link>
            </div>
          );
        },
        meta: {
          className: "w-1/6",
          cellClassName: "text-gray-800 font-normal",
        },
      },
    ],
    [tasks, giveawayNames]
  );

  const data = useMemo(() => tasks, [tasks]);

  return (
    <div className="px-6">
      <div className="flex justify-between items-center pb-4">
        <h1 className="text-2xl lg:text-3xl font-bold leading-none text-gray-900">
          Промокоды
        </h1>
        <Link
          className="btn-sm lg:btn-lg btn btn-primary"
          to="/promocodes/create-update-promocodes"
        >
          Добавить промокод
        </Link>
      </div>
      <div>
        <PromocodesFilterTable />
      </div>
      <div className="card card-grid h-full min-w-full">
        <div className="card-header">
          <h3 className="card-title">Список промокодов</h3>
        </div>
        <div className="card-body">
          <DataGrid
            key={`datagrid-${refreshKey}-${JSON.stringify(filterOptions)}`}
            columns={columns}
            data={data}
            rowSelect={true}
            serverSide={true}
            pagination={{
              size,
              page: activePage || 0,
              pageCount: totalPages || 1,
              onPageChange: setActivePage,
            }}
            filters={filterOptions}
            onFetchData={fetchPromocodes}
            sorting={[{ id: "position", desc: false }]}
          />
        </div>
      </div>
    </div>
  );
};
