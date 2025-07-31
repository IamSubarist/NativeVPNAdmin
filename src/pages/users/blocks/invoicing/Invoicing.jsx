/* eslint-disable prettier/prettier */
import { useEffect, useState, useMemo, useContext } from "react";
import { DataGrid, KeenIcon } from "@/components";
import { getUsersData } from "./";
import { ModalContext } from "@/providers/ModalProvider";
import { FilterContext } from "@/providers/FilterProvider";
import { usePagination } from "@/providers/PaginationContext";
import { FilterTabel } from "../../FilterTabel";

const Invoicing = () => {
  const [emptyTrigger, setEmptyTrigger] = useState(0);

  const { activePage, setActivePage, totalPages, setTotalPages } =
    usePagination();
  const [size, setSize] = useState(10);
  const { filterOptions, newListUsers } = useContext(FilterContext);
  const { openModal, isModalOpen } = useContext(ModalContext);
  const [users, setUsers] = useState([]);
  const [refreshCounter, setRefreshCounter] = useState(0);
  const { setRefreshTrigger } = useContext(ModalContext);

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
        accessorFn: (row) => row.id,
        id: "id",
        header: () => "ID",
        enableSorting: true,
        cell: (info) => {
          return (
            <div className="flex items-center gap-2">
              <div className="flex flex-col gap-1">
                {info.row.original.status === "green" ? (
                  <span
                    style={{
                      width: "10px",
                      height: "10px",
                      borderRadius: "50%",
                      backgroundColor: "#04B440",
                    }}
                  ></span>
                ) : info.row.original.status === "yellow" ? (
                  <span
                    style={{
                      width: "10px",
                      height: "10px",
                      borderRadius: "50%",
                      backgroundColor: "#DFA000",
                    }}
                  ></span>
                ) : (
                  <span
                    style={{
                      width: "10px",
                      height: "10px",
                      borderRadius: "50%",
                      backgroundColor: "#DBDFE9",
                    }}
                  ></span>
                )}
              </div>

              <div> {info.row.original.id}</div>
            </div>
          );
        },
        meta: {
          className: "min-w-[100px]",
          cellClassName: "text-gray-800 font-normal",
        },
      },
      {
        accessorFn: (row) => row.registered_at,
        id: "registered_at",
        header: () => "Дата рег.",
        cell: (info) => {
          const formattedDate = new Date(
            info.row.original.registered_at
          ).toLocaleDateString("ru-RU");
          return <div className="min-w-[110px]">{formattedDate}</div>;
        },
        meta: {
          className: "min-w-[170px]",
          cellClassName: "text-gray-800 font-normal",
        },
      },
      {
        accessorFn: (row) => row.telegram,
        id: "telegram",
        header: () => "Telegram",
        cell: (info) => {
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
              <span>{formatTelegram(info.row.original.telegram)}</span>
            </div>
          );
        },
        meta: {
          className: "w-[170px]",
          cellClassName: "text-gray-800 font-normal",
        },
      },
      {
        accessorFn: (row) => row.balance_current,
        id: "balance_current",
        header: () => "Баланс текущий",
        cell: (info) => {
          return <div className="">{info.row.original.balance_current}</div>;
        },
        meta: {
          className: "min-w-[160px]",
          cellClassName: "text-gray-800 font-normal",
        },
      },
      {
        accessorFn: (row) => row.days_access,
        id: "days_access",
        header: () => "Дней доступа",
        cell: (info) => {
          return <div className="">{info.row.original.days_access}</div>;
        },
        meta: {
          className: "min-w-[140px]",
          cellClassName: "text-gray-800 font-normal",
        },
      },
      {
        accessorFn: (row) => row.number_of_balance_top_ups,
        id: "number_of_balance_top_ups",
        header: () => "Кол-во пополнений",
        cell: (info) => {
          return (
            <div className="">
              {info.row.original.number_of_balance_top_ups}
            </div>
          );
        },
        meta: {
          className: "min-w-[210px]",
          cellClassName: "text-gray-800 font-normal",
        },
      },
      {
        accessorFn: (row) => row.total_top_up_amount,
        id: "total_top_up_amount",
        header: () => "Сумма пополнений",
        cell: (info) => {
          return (
            <div className="">{info.row.original.total_top_up_amount}</div>
          );
        },
        meta: {
          className: "min-w-[180px]",
          cellClassName: "text-gray-800 font-normal",
        },
      },
      {
        accessorFn: (row) => row.date_of_last_replenishment,
        id: "date_of_last_replenishment",
        header: () => "Дата рег.",
        cell: (info) => {
          const formattedDate = new Date(
            info.row.original.date_of_last_replenishment
          ).toLocaleDateString("ru-RU");
          return (
            <div className="min-w-[110px]">
              {info.row.original.date_of_last_replenishment
                ? formattedDate
                : "—"}
            </div>
          );
        },
        meta: {
          className: "min-w-[170px]",
          cellClassName: "text-gray-800 font-normal",
        },
      },
      {
        accessorFn: (row) => row.referrals,
        id: "referrals",
        header: () => "Рефералов",
        cell: (info) => {
          return <div className="">{info.row.original.referrals}</div>;
        },
        meta: {
          className: "min-w-[100px]",
          cellClassName: "text-gray-800 font-normal",
        },
      },
      {
        accessorFn: (row) => row.referral_income,
        id: "referral_income",
        header: () => "Доход с рефералов",
        cell: (info) => {
          return <div className="">{info.row.original.referral_income}</div>;
        },
        meta: {
          className: "min-w-[170px]",
          cellClassName: "text-gray-800 font-normal",
        },
      },
      {
        accessorFn: (row) => row.gifts,
        id: "gifts",
        header: () => "Подарков",
        cell: (info) => {
          return <div className="">{info.row.original.gifts}</div>;
        },
        meta: {
          className: "min-w-[100px]",
          cellClassName: "text-gray-800 font-normal",
        },
      },
      {
        accessorFn: (row) => row.traffic_used_gb,
        id: "traffic_used_gb",
        header: () => "Использованный трафик (ГБ)",
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
          className: "min-w-[260px]",
          cellClassName: "text-gray-800 font-normal",
        },
      },
    ],
    []
  );

  const columnPast = useMemo(
    () => [
      {
        accessorFn: (row) => row.user_id,
        id: "user_id",
        header: () => "ID",
        enableSorting: true,
        cell: (info) => {
          return (
            <div className="flex items-center gap-2">
              <div className="flex flex-col gap-1">
                {info.row.original.gs_subscription === "PRO" ? (
                  <span
                    style={{
                      width: "6px",
                      height: "6px",
                      borderRadius: "50%",
                      backgroundColor: "#04B440",
                    }}
                  ></span>
                ) : info.row.original.gs_subscription === "LITE" ? (
                  <span
                    style={{
                      width: "6px",
                      height: "6px",
                      borderRadius: "50%",
                      backgroundColor: "#DFA000",
                    }}
                  ></span>
                ) : info.row.original.gs_subscription === "FULL" ? (
                  <>
                    <span
                      style={{
                        width: "6px",
                        height: "6px",
                        borderRadius: "50%",
                        backgroundColor: "#DFA000",
                      }}
                    ></span>
                    <span
                      style={{
                        width: "6px",
                        height: "6px",
                        borderRadius: "50%",
                        backgroundColor: "#04B440",
                      }}
                    ></span>
                  </>
                ) : (
                  <span
                    style={{
                      width: "6px",
                      height: "6px",
                      borderRadius: "50%",
                      backgroundColor: "#DBDFE9",
                    }}
                  ></span>
                )}
              </div>

              <div> {info.row.original.id}</div>
            </div>
          );
        },
        meta: {
          className: "min-w-[100px]",
          cellClassName: "text-gray-800 font-normal",
        },
      },
      {
        accessorFn: (row) => row.gs_id,
        id: "gs_id",
        header: () => "Дата регистрации",
        cell: (info) => {
          const handleClick = () => {
            openModal("userSettings", info.row.original.id, "users");
          };
          return (
            <div
              className="text-primary cursor-pointer min-w-[40px]"
              onClick={handleClick}
            >
              {info.row.original.gs_id}
            </div>
          );
        },
        meta: {
          className: "w-[170px]",
        },
      },
      {
        accessorFn: (row) => row.created_at,
        id: "created_at",
        header: () => "Дата рег.",
        cell: (info) => {
          const formattedDate = new Date(
            info.row.original.created_at
          ).toLocaleDateString("ru-RU");
          return <div className="min-w-[110px]">{formattedDate}</div>;
        },
        meta: {
          className: "min-w-[170px]",
          cellClassName: "text-gray-800 font-normal",
        },
      },
      {
        accessorFn: (row) => row.tg_id,
        id: "tg_id",
        header: () => "Telegram",
        cell: (info) => {
          return info.row.original.username ? (
            <div className="min-w-[219px]">@{info.row.original.username}</div>
          ) : info.row.original.tg_id ? (
            <div className="min-w-[219px]">id{info.row.original.tg_id}</div>
          ) : (
            <div className="min-w-[219px]">-</div>
          );
        },
        meta: {
          className: "w-[170px]",
          cellClassName: "text-gray-800 font-normal",
        },
      },
      {
        accessorFn: (row) => row.phone,
        id: "vk",
        header: () => "VK",
        cell: (info) => {
          return (
            <div className="min-w-[151px] flex items-center justify-start gap-2">
              {/* <KeenIcon icon={"phone"} /> */}
              <span className="text-md ki-filled ki-exit-right-corner text-[#99A1B7]" />
              <div>
                {info.row.original.vk_id !== null ? (
                  <div className="text-primary">
                    id{info.row.original.vk_id}
                  </div>
                ) : (
                  "-"
                )}
              </div>
            </div>
          );
        },
        meta: {
          className: "w-[170px]",
          cellClassName: "text-gray-800 font-normal",
        },
      },
      {
        accessorFn: (row) => row.phone,
        id: "phone",
        header: () => "Телефон",
        cell: (info) => {
          return (
            <div className="min-w-[151px] flex items-center justify-start gap-2">
              {/* <KeenIcon icon={"phone"} /> */}
              <span className="text-md ki-filled ki-phone text-[#99A1B7]" />
              <div>
                {info.row.original.phone !== null ? (
                  <div className="text-primary">{info.row.original.phone}</div>
                ) : (
                  "-"
                )}
              </div>
            </div>
          );
        },
        meta: {
          className: "w-[170px]",
          cellClassName: "text-gray-800 font-normal",
        },
      },

      {
        accessorFn: (row) => row.email,
        id: "email",
        header: () => "Email",
        cell: (info) => {
          return (
            <div className="min-w-[241px] flex items-center justify-start gap-2">
              <span className="text-md ki-filled ki-sms text-[#99A1B7]" />
              {/* <KeenIcon icon={"sms"} /> */}
              <div>
                {info.row.original.email !== null ? (
                  <div className="text-primary">{info.row.original.email}</div>
                ) : (
                  "-"
                )}
              </div>
            </div>
          );
        },
        meta: {
          className: "w-[170px]",
          cellClassName: "text-gray-800 font-normal",
        },
      },

      {
        accessorFn: (row) => row.balance,
        id: "balance",
        header: () => "Баланс",
        cell: (info) => {
          return <div className="">{info.row.original.balance}</div>;
        },
        meta: {
          className: "w-[170px]",
          cellClassName: "text-gray-800 font-normal",
        },
      },

      {
        accessorFn: (row) => row.giveaways_count,
        id: "giveaways_count",
        header: () => "Конкурсы",
        cell: (info) => {
          return <div className="">{info.row.original.giveaways_count}</div>;
        },
        meta: {
          className: "w-[170px]",
          cellClassName: "text-gray-800 font-normal",
        },
      },

      {
        accessorFn: (row) => row.completed_tasks,
        id: "completed_tasks",
        header: () => "Заданий",
        cell: (info) => {
          return <div className="">{info.row.original.completed_tasks}</div>;
        },
        meta: {
          className: "w-[170px]",
          cellClassName: "text-gray-800 font-normal",
        },
      },

      {
        accessorFn: (row) => row.referals_count,
        id: "referals_count",
        header: () => "Рефералов",
        cell: (info) => {
          return <div className="">{info.row.original.referals_count}</div>;
        },
        meta: {
          className: "w-[170px]",
          cellClassName: "text-gray-800 font-normal",
        },
      },

      {
        accessorFn: (row) => row.settings,
        id: "settings",
        header: () => "Настройки",
        cell: (info) => {
          const handleClick = () => {
            openModal("userSettings", info.row.original.id, "users");
          };
          return (
            <div
              className=" flex items-center justify-center"
              onClick={handleClick}
            >
              <button className="ki-filled text-[x-large] text-primary">
                <KeenIcon icon={"setting-2"} />
              </button>
              {info.row.original.settings}
            </div>
          );
        },
        meta: {
          className: "w-[170px] cursor-pointer",
          cellClassName: "text-gray-800 font-normal",
        },
      },
    ],
    []
  );
  console.log("users", users);

  const data = useMemo(() => users, [users]);

  return (
    <div className="px-6">
      <div className="flex justify-between items-center pb-4">
        <h1 className="text-2xl lg:text-3xl font-bold leading-none text-gray-900">
          Пользователи
        </h1>
      </div>
      <div>
        <FilterTabel />
      </div>
      <div className="card card-grid min-w-full">
        <div className="card-header">
          <h3 className="card-title">Список пользователей</h3>
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
export { Invoicing };
