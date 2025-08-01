/* eslint-disable prettier/prettier */
import { useEffect, useState, useMemo, useContext } from "react";
import { DataGrid, KeenIcon } from "@/components";
import { getUsersData } from "./";
import { ModalContext } from "@/providers/ModalProvider";
import { FilterContext } from "@/providers/FilterProvider";
import { usePagination } from "@/providers/PaginationContext";
import { FilterTabel } from "../../FilterTabel";
import { UserTransactionFilters } from "./UserTransactionFilters";
import { Link, useLocation } from "react-router-dom";
import { Input } from "antd";
import { toast, Bounce } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { InfoCard } from "./InfoCard";

const UserDetail = () => {
  const [emptyTrigger, setEmptyTrigger] = useState(0);

  const { activePage, setActivePage, totalPages, setTotalPages } =
    usePagination();
  const [size, setSize] = useState(10);
  const { filterOptions, newListUsers } = useContext(FilterContext);
  const { openModal, isModalOpen } = useContext(ModalContext);
  const [users, setUsers] = useState([]);
  const [refreshCounter, setRefreshCounter] = useState(0);
  const { setRefreshTrigger } = useContext(ModalContext);

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

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(
        "https://t.me/NativeVPN_bot?=start=REF_ID"
      );
      showAlert("success", "Ссылка скопирована!");
    } catch (err) {
      showAlert("error", "Ошибка при копировании");
      console.error("Ошибка при копировании:", err);
    }
  };

  useEffect(() => {
    // Устанавливаем в контекст функцию, которую можно будет вызвать из модалки
    setRefreshTrigger(() => () => setRefreshCounter((prev) => prev + 1));
  }, []);

  const fetchUsers = async ({ pageIndex, pageSize, filters, sorting }) => {
    const sortingParams = sorting[0] || { id: null, desc: false };
    const params = {
      page: pageIndex + 1,
      per_page: pageSize,
      ...filters,
    };
    // Добавляем параметры сортировки только если есть поле для сортировки
    // if (sortingParams.id) {
    //   params.order_by = sortingParams.id;
    //   params.order_direction = sortingParams.desc ? "desc" : "asc";
    // } else {
    //   // По умолчанию сортируем по user_id в убывающем порядке
    //   params.order_by = "id";
    //   params.order_direction = "desc";
    // }
    const usersData = await getUsersData({ params });

    setTotalPages(usersData.total_pages);
    setSize(usersData.per_page);
    setUsers(usersData.items);
    if (usersData.items.length === 0 && users.length !== 0) {
      setEmptyTrigger((prev) => prev + 1);
    }

    return {
      data: usersData.items,
      totalCount: usersData.total_items,
    };
  };

  useEffect(() => {
    if (filterOptions) {
      setActivePage(0);
    }
  }, [filterOptions]);

  useEffect(() => {
    console.log(isModalOpen, "isModalOpen");

    if (isModalOpen === false) {
      setTimeout(() => {
        fetchUsers(1);
      }, 500);
    }
  }, [isModalOpen]);

  const columns = useMemo(
    () => [
      {
        accessorFn: (row) => row.registered_at,
        id: "registered_at",
        header: () => "Дата и время",
        cell: (info) => {
          const formattedDate = new Date(
            info.row.original.registered_at
          ).toLocaleDateString("ru-RU");
          return <div className="min-w-[110px]">{formattedDate}</div>;
        },
        meta: {
          className: "min-w-[169px]",
          cellClassName: "text-gray-800 font-normal",
        },
      },
      {
        accessorFn: (row) => row.balance_current,
        id: "balance_current",
        header: () => "Статус",
        cell: (info) => {
          return <div className="">{info.row.original.balance_current}</div>;
        },
        meta: {
          className: "min-w-[106px]",
          cellClassName: "text-gray-800 font-normal",
        },
      },
      {
        accessorFn: (row) => row.days_access,
        id: "days_access",
        header: () => "Сумма",
        cell: (info) => {
          return <div className="">{info.row.original.days_access}</div>;
        },
        meta: {
          className: "min-w-[100px]",
          cellClassName: "text-gray-800 font-normal",
        },
      },
      {
        accessorFn: (row) => row.number_of_balance_top_ups,
        id: "number_of_balance_top_ups",
        header: () => "Промокод",
        cell: (info) => {
          return (
            <div className="">
              {info.row.original.number_of_balance_top_ups}
            </div>
          );
        },
        meta: {
          className: "min-w-[230px]",
          cellClassName: "text-gray-800 font-normal",
        },
      },
      {
        accessorFn: (row) => row.total_top_up_amount,
        id: "total_top_up_amount",
        header: () => "Тип",
        cell: (info) => {
          return (
            <div className="">{info.row.original.total_top_up_amount}</div>
          );
        },
        meta: {
          className: "min-w-[125px]",
          cellClassName: "text-gray-800 font-normal",
        },
      },

      {
        accessorFn: (row) => row.referrals,
        id: "referrals",
        header: () => "Способ",
        cell: (info) => {
          return <div className="">{info.row.original.referrals}</div>;
        },
        meta: {
          className: "min-w-[106px]",
          cellClassName: "text-gray-800 font-normal",
        },
      },
      {
        accessorFn: (row) => row.referral_income,
        id: "referral_income",
        header: () => "Шлюз",
        cell: (info) => {
          return <div className="">{info.row.original.referral_income}</div>;
        },
        meta: {
          className: "min-w-[144px]",
          cellClassName: "text-gray-800 font-normal",
        },
      },
      {
        accessorFn: (row) => row.gifts,
        id: "gifts",
        header: () => "Банк",
        cell: (info) => {
          return <div className="">{info.row.original.gifts}</div>;
        },
        meta: {
          className: "min-w-[122px]",
          cellClassName: "text-gray-800 font-normal",
        },
      },
      {
        accessorFn: (row) => row.traffic_used_gb,
        id: "traffic_used_gb",
        header: () => "Карта",
        cell: (info) => {
          return (
            <div className="">
              {info.row.original.traffic_used_gb
                ? info.row.original.traffic_used_gb
                : "—"}
            </div>
          );
        },
        meta: {
          className: "min-w-[215px]",
          cellClassName: "text-gray-800 font-normal",
        },
      },
      {
        accessorFn: (row) => row.gifts,
        id: "gifts",
        header: () => "ID транзакции",
        cell: (info) => {
          return <div className="">{info.row.original.gifts}</div>;
        },
        meta: {
          className: "min-w-[131px]",
          cellClassName: "text-gray-800 font-normal",
        },
      },
      {
        accessorFn: (row) => row.gifts,
        id: "gifts",
        header: () => "ID на шлюзе",
        cell: (info) => {
          return <div className="">{info.row.original.gifts}</div>;
        },
        meta: {
          className: "min-w-[122px]",
          cellClassName: "text-gray-800 font-normal",
        },
      },
    ],
    []
  );
  console.log("users", users);

  const data = useMemo(() => users, [users]);

  const location = useLocation();
  const userItem = location.state?.userItem;

  const tableOneInfo = [
    {
      label: "Дата регистрации",
      value: userItem.registered_at,
    },
    {
      label: "Статус аккаунта пользователя",
      value: userItem.status,
    },
    {
      label: "Баланс текущий",
      value: `${userItem.balance_current}₽`,
    },
    {
      label: "Последнее пополнение",
      value: userItem.date_of_last_replenishment,
    },
    {
      label: "Количество и сумма пополнений",
      value: `${userItem.number_of_balance_top_ups} | ${userItem.total_top_up_amount}₽`,
    },
    {
      label: "Средняя сумма пополнения",
      value: "100₽ (mock)",
    },
    {
      label: "Telegram",
      value: userItem.telegram,
    },
  ];

  const tableTwoInfo = [
    {
      label: "Использованный трафик (ГБ)",
      value: userItem.traffic_used_gb,
    },
    {
      label: "Рефералов | доход",
      value: `${userItem.referrals} | ${userItem.referral_income}₽`,
    },
    {
      label: "Подарков отправлено",
      value: userItem.gifts,
    },
    {
      label: "Промокодов активировано",
      value: "4 (mock)",
    },
    {
      label: "Средняя скорость трафика",
      value: `10 мбит/с (mock)`,
    },
  ];

  return (
    <div className="px-6 flex flex-col gap-8">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="relative text-2xl lg:text-3xl font-bold leading-none text-gray-900 flex gap-1">
            Данные {userItem.telegram}{" "}
            <div className="flex gap-1">
              <span className="text-[#4B5675] font-light">
                (ID:{userItem.id})
              </span>
              {/* <span className="text-[10px] font-light text-[#F8285A] bg-[#FFEEF3] w-[39px] h-[18px] flex items-center justify-center border border-[#F8285A33]/20 rounded-[3px]">
                Блок
              </span> */}
            </div>
          </h1>
          <span className="text-[12px] text-[#99A1B7]">
            Последнее устройство пользователя: IOS (12.12.2025 — 16:53)
          </span>
        </div>
        {/* <button className="bg-[#17C653] w-[126px] h-[48px] rounded-[6px] text-center text-white">
          Снять блок
        </button> */}
        <button className="flex items-center justify-center btn btn-danger btn-outline w-[126px] h-[48px] rounded-[6px] text-center text-white">
          Блокировать
        </button>
      </div>
      <div className="bg-[#FFFFFF] border border-[#F1F1F4] rounded-[12px] p-4 flex flex-col gap-4">
        <div className="flex gap-4">
          <div className="w-1/2 flex flex-col border border-[#F1F1F4] rounded-[4px]">
            {tableOneInfo.map((item, index) => {
              const formattedDate = new Date(item.value).toLocaleDateString(
                "ru-RU"
              );
              const formatTelegram = (telegram) => {
                if (!telegram) return "-";

                // Убираем @ если есть
                const cleanTelegram = telegram.replace(/^@/, "");

                // Проверяем, содержит ли только цифры
                if (/^\d+$/.test(cleanTelegram)) {
                  return `id${cleanTelegram}`;
                } else {
                  // Если содержит буквы или другие символы - это username
                  return `@${cleanTelegram}`;
                }
              };
              return (
                <div
                  key={index}
                  className={`flex items-center justify-center first:rounded-t-[4px] last:rounded-b-[4px] px-[14px] text-[14px] border-b border-[#F1F1F4] last:border-b-0 ${
                    index % 2 === 0 ? "bg-[#F9F9F9]" : "bg-[#FFFFFF]"
                  }`}
                >
                  <span className="w-1/2 border-r border-[#F1F1F4] mr-[14px] h-[34px] flex items-center">
                    {item.label}
                  </span>
                  <span className="w-1/2">
                    {item.label === "Дата регистрации" ||
                    item.label === "Последнее пополнение" ? (
                      item.value === null ? (
                        "—"
                      ) : (
                        formattedDate
                      )
                    ) : item.label === "Статус аккаунта пользователя" ? (
                      item.value === "green" ? (
                        <div className="flex items-center gap-[10px]">
                          <div className="w-[10px] h-[10px] rounded-full bg-[#04B440]"></div>
                          <span>Платящий</span>
                        </div>
                      ) : item.value === "yellow" ? (
                        <div className="flex items-center gap-[10px]">
                          <div className="w-[10px] h-[10px] rounded-full bg-[#DFA000]"></div>
                          <span>Действует триал</span>
                        </div>
                      ) : (
                        <div className="flex items-center gap-[10px]">
                          <div className="w-[10px] h-[10px] rounded-full bg-[#DBDFE9]"></div>
                          <span>Закончился триал</span>
                        </div>
                      )
                    ) : item.label === "Telegram" ? (
                      <div className="text-primary flex items-center gap-[10px]">
                        <svg
                          width="16"
                          height="16"
                          viewBox="0 0 16 16"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            d="M8.59202 11.9156L5.72168 14.7773C5.63577 14.8289 5.52405 14.9578 5.29199 14.889C5.17171 14.8461 5.02559 14.7085 4.99983 14.5539V14.5453L4.1748 9.61247L4.84515 9.10547C4.93194 9.15637 6.58836 10.1277 6.48652 10.068L8.59199 11.3055C8.7553 11.4773 8.7553 11.7437 8.59202 11.9156Z"
                            fill="#009AE4"
                          />
                          <path
                            d="M15.3243 1.61546L12.7173 14.5631C12.6915 14.7006 12.5884 14.821 12.4509 14.8725C12.3993 14.8983 12.3478 14.9069 12.2962 14.9069C12.2103 14.9069 12.1243 14.8811 12.047 14.8295C11.9605 14.7678 5.62859 10.245 6.03138 10.5327C2.19742 8.63346 4.19727 9.63168 0.90664 7.98893C0.751953 7.91158 0.666016 7.7569 0.666016 7.59361C0.674609 7.42174 0.769141 7.27565 0.923828 7.2069L14.7313 1.13421C14.8774 1.07405 15.0493 1.09124 15.1696 1.19437C15.1868 1.21155 15.2126 1.23734 15.2298 1.25452C15.3157 1.35765 15.3501 1.48655 15.3243 1.61546Z"
                            fill="#25D9F8"
                          />
                          <path
                            d="M15.2304 1.25391L6.4875 10.068L6.03206 10.532L5.29297 14.8891C5.17268 14.8461 5.02656 14.7086 5.00081 14.5539V14.5453L4.17578 9.6125L4.84612 9.10549L15.2304 1.25391Z"
                            fill="#00C0F1"
                          />
                        </svg>{" "}
                        <span>{formatTelegram(item.value)}</span>
                      </div>
                    ) : (
                      item.value
                    )}
                  </span>
                </div>
              );
            })}
          </div>
          <div className="h-full w-1/2 flex flex-col border border-[#F1F1F4] rounded-[4px]">
            {tableTwoInfo.map((item, index) => {
              const formattedDate = new Date(item.value).toLocaleDateString(
                "ru-RU"
              );
              return (
                <div
                  key={index}
                  className={`flex items-center justify-center first:rounded-t-[4px] last:rounded-b-[4px] px-[14px] text-[14px] border-b border-[#F1F1F4] last:border-b-0 ${
                    index % 2 === 1 ? "bg-[#F9F9F9]" : "bg-[#FFFFFF]"
                  }`}
                >
                  <span className="w-1/2 border-r border-[#F1F1F4] mr-[14px] h-[34px] flex items-center">
                    {item.label}
                  </span>
                  <span className="w-1/2">{item.value}</span>
                </div>
              );
            })}
          </div>
        </div>
        <div className="w-full relative">
          {" "}
          <label
            style={{
              color: "#99A1B7",
              fontSize: "11px",
              display: "inline",
              marginBottom: "0px",
            }}
            className="absolute top-[-10px] px-1 left-2 z-10 text-sm font-medium text-gray-900
             before:content-[''] before:absolute before:top-1/2 before:left-0
             before:w-full before:h-1/2 before:bg-[#FCFCFC] before:z-[-1]"
          >
            Реферальная ссылка
          </label>
          <div
            onClick={handleCopyLink}
            className="cursor-pointer flex justify-between border border-[#DBDFE9] rounded-[6px] h-[40px] items-center px-[12px]"
          >
            <span className="text-[13px] text-primary">
              https://t.me/NativeVPN_bot?=start=REF_ID
            </span>
            <button className="text-[14.67px] text-[#99A1B7]">
              <KeenIcon icon={"copy"} />
            </button>
          </div>
        </div>
      </div>
      <div>
        <h1 className="relative text-2xl lg:text-3xl font-bold leading-none text-gray-900 flex gap-1 mb-4">
          Транзакции
        </h1>
        <UserTransactionFilters />
        <div className="flex gap-4">
          <InfoCard
            title="Успешные транзакции"
            iconName="copy-success"
            iconColor="text-[#17C653]"
            value="2265"
            trend={{ value: "65%", trend: true }}
          />
          <InfoCard
            title="Неудачные оплаты"
            iconName="cross-circle"
            iconColor="text-[#F8285A]"
            value="1265"
            trend={{ value: "5%", trend: true }}
          />
          <InfoCard
            title="Подарки"
            iconName="gift"
            iconColor="text-[#1B84FF]"
            value="1265"
            trend={{ value: "5%", trend: true }}
          />
        </div>
      </div>
      <div className="card card-grid min-w-full">
        <div className="card-header">
          <h3 className="card-title">Список транзакций</h3>
          <div className="flex gap-2">
            <button className="w-[187px] h-[40px] flex items-center justify-center gap-[5px] rounded-[6px] border border-[#DBDFE9] text-[14px]">
              <KeenIcon
                icon={"setting-2"}
                className="text-[#99A1B7] text-[16px]"
              />
              Настройки таблицы
            </button>
            <button className="w-[158px] h-[40px] flex items-center justify-center btn-primary btn-outline rounded-[6px] border border-[#1B84FF33]/20 text-[14px]">
              Добавить возврат
            </button>
          </div>
        </div>
        <div className="card-body">
          <DataGrid
            key={`${JSON.stringify(filterOptions)}-${refreshCounter}-${emptyTrigger}`}
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
            onFetchData={fetchUsers}
            sorting={[{ id: "id", desc: true }]}
          />
        </div>
      </div>
    </div>
  );
};
export { UserDetail };
