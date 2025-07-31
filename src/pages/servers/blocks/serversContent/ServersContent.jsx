import React, { useEffect, useMemo, useState, useContext, useRef } from "react";
import axiosInstance from "@/axiosConfig";
import {
  useReactTable,
  getCoreRowModel,
  flexRender,
} from "@tanstack/react-table";
import { ServersFilterContext } from "@/providers/ServersFilterProvider";
import { usePagination } from "@/providers/PaginationContext";
import { ServersFilterTable } from "../../ServersFilterTable";
import { BASE_URL } from "../../../../static";
import {
  DataGrid,
  DataGridProvider,
  DataGridToolbar,
} from "../../../../components";
import { getServersData } from "./ServersData";
import dayjs from "dayjs";
import { KeenIcon } from "@/components";
import { Modal, Switch, Radio } from "antd";
import { useCallback } from "react";

export const countryFlagMap = {
  AE: "united-arab-emirates",
  AF: "afghanistan",
  AL: "albania",
  AM: "armenia",
  AO: "angola",
  AR: "argentina",
  AT: "austria",
  AU: "australia",
  AZ: "azerbaijan",
  BA: "bosnia-and-herzegovina",
  BB: "barbados",
  BD: "bangladesh",
  BE: "belgium",
  BF: "burkina-faso",
  BG: "bulgaria",
  BH: "bahrain",
  BI: "burundi",
  BJ: "benin",
  BN: "brunei",
  BO: "bolivia",
  BR: "brazil",
  BS: "bahamas",
  BT: "bhutan",
  BW: "botswana",
  BY: "belarus",
  BZ: "belize",
  CA: "canada",
  CD: "democratic-republic-of-the-congo",
  CF: "central-african-republic",
  CG: "republic-of-the-congo",
  CH: "switzerland",
  CI: "cote-divoire",
  CL: "chile",
  CM: "cameroon",
  CN: "china",
  CO: "colombia",
  CR: "costa-rica",
  CU: "cuba",
  CV: "cape-verde",
  CY: "cyprus",
  CZ: "czech-republic",
  DE: "germany",
  DJ: "djibouti",
  DK: "denmark",
  DM: "dominica",
  DO: "dominican-republic",
  DZ: "algeria",
  EC: "ecuador",
  EE: "estonia",
  EG: "egypt",
  ER: "eritrea",
  ES: "spain",
  ET: "ethiopia",
  FI: "finland",
  FJ: "fiji",
  FM: "micronesia",
  FR: "france",
  GA: "gabon",
  GB: "united-kingdom",
  GD: "grenada",
  GE: "georgia",
  GH: "ghana",
  GM: "gambia",
  GN: "guinea",
  GQ: "equatorial-guinea",
  GR: "greece",
  GT: "guatemala",
  GW: "guinea-bissau",
  GY: "guyana",
  HK: "hong-kong",
  HN: "honduras",
  HR: "croatia",
  HT: "haiti",
  HU: "hungary",
  ID: "indonesia",
  IE: "ireland",
  IL: "israel",
  IN: "india",
  IQ: "iraq",
  IR: "iran",
  IS: "iceland",
  IT: "italy",
  JM: "jamaica",
  JO: "jordan",
  JP: "japan",
  KE: "kenya",
  KG: "kyrgyzstan",
  KH: "cambodia",
  KI: "kiribati",
  KM: "comoros",
  KN: "saint-kitts-and-nevis",
  KP: "north-korea",
  KR: "south-korea",
  KW: "kuwait",
  KZ: "kazakhstan",
  LA: "laos",
  LB: "lebanon",
  LC: "st-lucia",
  LI: "liechtenstein",
  LK: "sri-lanka",
  LR: "liberia",
  LS: "lesotho",
  LT: "lithuania",
  LU: "luxembourg",
  LV: "latvia",
  LY: "libya",
  MA: "morocco",
  MC: "monaco",
  MD: "moldova",
  ME: "montenegro",
  MG: "madagascar",
  MH: "marshall-islands",
  MK: "republic-of-macedonia",
  ML: "mali",
  MM: "myanmar",
  MN: "mongolia",
  MR: "mauritania",
  MT: "malta",
  MU: "mauritius",
  MV: "maldives",
  MW: "malawi",
  MX: "mexico",
  MY: "malaysia",
  MZ: "mozambique",
  NA: "namibia",
  NE: "niger",
  NG: "nigeria",
  NI: "nicaragua",
  NL: "netherlands",
  NO: "norway",
  NP: "nepal",
  NR: "nauru",
  NZ: "new-zealand",
  OM: "oman",
  PA: "panama",
  PE: "peru",
  PG: "papua-new-guinea",
  PH: "philippines",
  PK: "pakistan",
  PL: "poland",
  PT: "portugal",
  PW: "palau",
  PY: "paraguay",
  QA: "qatar",
  RO: "romania",
  RS: "serbia",
  RU: "russia",
  RW: "rwanda",
  SA: "saudi-arabia",
  SB: "solomon-islands",
  SC: "seychelles",
  SD: "sudan",
  SE: "sweden",
  SG: "singapore",
  SI: "slovenia",
  SK: "slovakia",
  SL: "sierra-leone",
  SM: "san-marino",
  SN: "senegal",
  SO: "somalia",
  SR: "suriname",
  ST: "sao-tome-and-prince",
  SV: "el-salvador",
  SY: "syria",
  SZ: "swaziland",
  TD: "chad",
  TG: "togo",
  TH: "thailand",
  TJ: "tajikistan",
  TL: "timor-leste",
  TM: "turkmenistan",
  TN: "tunisia",
  TO: "tonga",
  TR: "turkey",
  TT: "trinidad-and-tobago",
  TV: "tuvalu",
  TZ: "tanzania",
  UA: "ukraine",
  UG: "uganda",
  US: "united-states",
  UY: "uruguay",
  UZ: "uzbekistan",
  VA: "vatican-city",
  VC: "st-vincent-and-the-grenadines",
  VE: "venezuela",
  VN: "vietnam",
  VU: "vanuatu",
  WS: "samoa",
  YE: "yemen",
  ZA: "zambia",
  ZM: "zambia",
  ZW: "zimbabwe",
  // ...дополни при необходимости, если найдёшь новые коды и файлы
};

export const countryNamesRu = {
  AE: "ОАЭ",
  AF: "Афганистан",
  AL: "Албания",
  AM: "Армения",
  AO: "Ангола",
  AR: "Аргентина",
  AT: "Австрия",
  AU: "Австралия",
  AZ: "Азербайджан",
  BA: "Босния и Герцеговина",
  BB: "Барбадос",
  BD: "Бангладеш",
  BE: "Бельгия",
  BF: "Буркина-Фасо",
  BG: "Болгария",
  BH: "Бахрейн",
  BI: "Бурунди",
  BJ: "Бенин",
  BN: "Бруней",
  BO: "Боливия",
  BR: "Бразилия",
  BS: "Багамы",
  BT: "Бутан",
  BW: "Ботсвана",
  BY: "Беларусь",
  BZ: "Белиз",
  CA: "Канада",
  CD: "Демократическая Республика Конго",
  CF: "Центральноафриканская Республика",
  CG: "Республика Конго",
  CH: "Швейцария",
  CI: "Кот-д’Ивуар",
  CL: "Чили",
  CM: "Камерун",
  CN: "Китай",
  CO: "Колумбия",
  CR: "Коста-Рика",
  CU: "Куба",
  CV: "Кабо-Верде",
  CY: "Кипр",
  CZ: "Чехия",
  DE: "Германия",
  DJ: "Джибути",
  DK: "Дания",
  DM: "Доминика",
  DO: "Доминиканская Республика",
  DZ: "Алжир",
  EC: "Эквадор",
  EE: "Эстония",
  EG: "Египет",
  ER: "Эритрея",
  ES: "Испания",
  ET: "Эфиопия",
  FI: "Финляндия",
  FJ: "Фиджи",
  FM: "Микронезия",
  FR: "Франция",
  GA: "Габон",
  GB: "Великобритания",
  GD: "Гренада",
  GE: "Грузия",
  GH: "Гана",
  GM: "Гамбия",
  GN: "Гвинея",
  GQ: "Экваториальная Гвинея",
  GR: "Греция",
  GT: "Гватемала",
  GW: "Гвинея-Бисау",
  GY: "Гайана",
  HK: "Гонконг",
  HN: "Гондурас",
  HR: "Хорватия",
  HT: "Гаити",
  HU: "Венгрия",
  ID: "Индонезия",
  IE: "Ирландия",
  IL: "Израиль",
  IN: "Индия",
  IQ: "Ирак",
  IR: "Иран",
  IS: "Исландия",
  IT: "Италия",
  JM: "Ямайка",
  JO: "Иордания",
  JP: "Япония",
  KE: "Кения",
  KG: "Киргизия",
  KH: "Камбоджа",
  KI: "Кирибати",
  KM: "Коморы",
  KN: "Сент-Китс и Невис",
  KP: "Северная Корея",
  KR: "Южная Корея",
  KW: "Кувейт",
  KZ: "Казахстан",
  LA: "Лаос",
  LB: "Ливан",
  LC: "Сент-Люсия",
  LI: "Лихтенштейн",
  LK: "Шри-Ланка",
  LR: "Либерия",
  LS: "Лесото",
  LT: "Литва",
  LU: "Люксембург",
  LV: "Латвия",
  LY: "Ливия",
  MA: "Марокко",
  MC: "Монако",
  MD: "Молдова",
  ME: "Черногория",
  MG: "Мадагаскар",
  MH: "Маршалловы Острова",
  MK: "Северная Македония",
  ML: "Мали",
  MM: "Мьянма",
  MN: "Монголия",
  MR: "Мавритания",
  MT: "Мальта",
  MU: "Маврикий",
  MV: "Мальдивы",
  MW: "Малави",
  MX: "Мексика",
  MY: "Малайзия",
  MZ: "Мозамбик",
  NA: "Намибия",
  NE: "Нигер",
  NG: "Нигерия",
  NI: "Никарагуа",
  NL: "Нидерланды",
  NO: "Норвегия",
  NP: "Непал",
  NR: "Науру",
  NZ: "Новая Зеландия",
  OM: "Оман",
  PA: "Панама",
  PE: "Перу",
  PG: "Папуа — Новая Гвинея",
  PH: "Филиппины",
  PK: "Пакистан",
  PL: "Польша",
  PT: "Португалия",
  PW: "Палау",
  PY: "Парагвай",
  QA: "Катар",
  RO: "Румыния",
  RS: "Сербия",
  RU: "Россия",
  RW: "Руанда",
  SA: "Саудовская Аравия",
  SB: "Соломоновы Острова",
  SC: "Сейшелы",
  SD: "Судан",
  SE: "Швеция",
  SG: "Сингапур",
  SI: "Словения",
  SK: "Словакия",
  SL: "Сьерра-Леоне",
  SM: "Сан-Марино",
  SN: "Сенегал",
  SO: "Сомали",
  SR: "Суринам",
  ST: "Сан-Томе и Принсипи",
  SV: "Сальвадор",
  SY: "Сирия",
  SZ: "Эсватини",
  TD: "Чад",
  TG: "Того",
  TH: "Таиланд",
  TJ: "Таджикистан",
  TL: "Восточный Тимор",
  TM: "Туркмения",
  TN: "Тунис",
  TO: "Тонга",
  TR: "Турция",
  TT: "Тринидад и Тобаго",
  TV: "Тувалу",
  TZ: "Танзания",
  UA: "Украина",
  UG: "Уганда",
  US: "США",
  UY: "Уругвай",
  UZ: "Узбекистан",
  VA: "Ватикан",
  VC: "Сент-Винсент и Гренадины",
  VE: "Венесуэла",
  VN: "Вьетнам",
  VU: "Вануату",
  WS: "Самоа",
  YE: "Йемен",
  ZA: "ЮАР",
  ZM: "Замбия",
  ZW: "Зимбабве",
};

export const ServersContent = () => {
  const [servers, setServers] = useState([]);
  const { filterOptions, updateServersList, newListServers } =
    useContext(ServersFilterContext);
  const [size, setSize] = useState(10);
  const [refreshKey, setRefreshKey] = useState(0);
  const [refreshCounter, setRefreshCounter] = useState(0); // Добавляем refreshCounter как в таблице пользователей
  // const { activePage, setTotalPages } = usePagination();
  const { activePage, setActivePage, setTotalPages, totalPages } =
    usePagination();
  const [stickyColumnId, setStickyColumnId] = useState("settings");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const mainTableRef = useRef(null);
  const stickyTableRef = useRef(null);

  const columnOptions = [
    { id: "ip", label: "IP / домен" },
    { id: "country", label: "Страна" },
    { id: "status", label: "Статус" },
    { id: "users", label: "Пользователей" },
    { id: "active_connections", label: "Активные подкл." },
    { id: "traffic", label: "Трафик, Тб." },
    { id: "cpu_load_avg_percent", label: "Ср. загр. CPU %" },
    { id: "ram_load_avg_percent", label: "Ср. загр. RAM %" },
    // { id: "uptime_percent", label: "Аптайм %" },
    { id: "speed_avg_mbps", label: "Ср. скор, Мбит/с" },
    // { id: "errors", label: "Ошибки" },
    { id: "last_reboot", label: "Дата перезагрузки" },
    { id: "config_updated_at", label: "Обновление конф." },
    { id: "settings", label: "Настройки" },
  ];
  const [isSettingsModalOpen, setIsSettingsModalOpen] = useState(false);
  // Состояние видимости колонок
  const [visibleColumns, setVisibleColumns] = useState(
    columnOptions.map((col) => col.id)
  );

  // Получение данных с API с поддержкой фильтров
  const fetchServers = async (filters = {}) => {
    try {
      // Используем filterOptions из контекста вместо filters от DataGrid
      const currentFilters = filterOptions || {};

      // Формируем объект params только с непустыми фильтрами
      const params = {};

      // Параметры пагинации от DataGrid
      if (filters.pageIndex !== undefined) {
        params.start = filters.pageIndex; // pageIndex уже начинается с 0
      } else {
        params.start = 0; // По умолчанию первая страница
      }

      if (filters.pageSize !== undefined) {
        params.limit = filters.pageSize;
      } else {
        params.limit = 10; // По умолчанию 10 элементов на страницу
      }

      // Используем фильтры из контекста
      if (currentFilters.domain) params.domain = currentFilters.domain;
      if (currentFilters.country) params.country = currentFilters.country;
      if (currentFilters.status) params.status = currentFilters.status;
      if (currentFilters.date_from) params.date_from = currentFilters.date_from;
      if (currentFilters.date_to) params.date_to = currentFilters.date_to;
      if (currentFilters.min_cpu !== undefined)
        params.min_cpu = currentFilters.min_cpu;
      if (currentFilters.max_cpu !== undefined)
        params.max_cpu = currentFilters.max_cpu;
      if (currentFilters.min_ram !== undefined)
        params.min_ram = currentFilters.min_ram;
      if (currentFilters.max_ram !== undefined)
        params.max_ram = currentFilters.max_ram;
      if (currentFilters.min_traffic !== undefined)
        params.min_traffic = currentFilters.min_traffic;
      if (currentFilters.max_traffic !== undefined)
        params.max_traffic = currentFilters.max_traffic;

      console.log("filterOptions из контекста:", currentFilters);
      console.log("Параметры запроса:", params);

      const response = await axiosInstance.get(
        "https://vpnbot.sjp-asia.group/admin_panel/api/servers/",
        { params }
      );
      setServers(response.data.items || []);

      // Убираем вызов updateServersList, так как DataGrid сам управляет запросами
      // if (updateServersList) {
      //   updateServersList(filters, params.start);
      // }

      return {
        data: response.data.items || [],
        totalCount: response.data.total_items || 0,
        totalPages: response.data.total_pages || 1,
      };
    } catch (error) {
      console.error("Ошибка при получении серверов:", error);
      setServers([]);
      return {
        data: [],
        totalCount: 0,
        totalPages: 1,
      };
    }
  };

  // Убираем useEffect, который создает лишние запросы
  // useEffect(() => {
  //   setActivePage(0);
  //   setFilterKey((prev) => prev + 1); // Обновляем ключ при изменении фильтров
  // }, [filterOptions, setActivePage]);

  // Добавляем useEffect для обновления refreshCounter при изменении filterOptions
  useEffect(() => {
    if (filterOptions) {
      setActivePage(0);
      setRefreshCounter((prev) => prev + 1);
    }
  }, [filterOptions, setActivePage]);

  // Мапа для сопоставления кодов стран с файлами флагов

  // Функция для sticky-мета
  function getStickyMeta(id, baseClass = "", baseCellClass = "") {
    return {
      className:
        stickyColumnId === id ? `${baseClass} sticky-right` : baseClass,
      cellClassName:
        stickyColumnId === id ? `${baseCellClass} sticky-right` : baseCellClass,
    };
  }

  const columns = useMemo(
    () => [
      {
        accessorFn: (row) => row.ip,
        id: "ip",
        header: () => "IP / домен",
        cell: (info) => {
          return (
            <div className="min-w-[320px]">
              <div>
                {info.row.original.ip}{" "}
                <span className="text-[#1B84FF] cursor-pointer">
                  {info.row.original.domain}
                </span>
              </div>
            </div>
          );
        },
        meta: getStickyMeta(
          "ip",
          "w-[170px] cursor-pointer",
          "text-gray-800 font-normal"
        ),
      },
      {
        accessorFn: (row) => row.country,
        id: "country",
        header: () => "Страна",
        cell: (info) => (
          <div className="flex justify-center">
            <img
              src={`/media/flags/${countryFlagMap[info.row.original.country] || "placeholder"}.svg`}
              alt={info.row.original.country}
              className="w-[16px] h-[16px] rounded-full object-cover"
            />
          </div>
        ),
        meta: getStickyMeta("country", "", "text-gray-800 font-normal"),
      },
      {
        accessorFn: (row) => row.status,
        id: "status",
        header: () => "Статус",
        cell: (info) => {
          return (
            <span
              className={`w-[16px] h-[16px] m-[4px] rounded-full ${info.row.original.status === "running" ? "bg-[#17C653]" : info.row.original.status === "overloaded" ? "bg-[#F6B100]" : info.row.original.status === "failed" ? "bg-[#F8285A]" : "bg-white border-3 border-[#8F8F8F]"}`}
            />
          );
        },
        meta: getStickyMeta("status", "", "flex items-center justify-center"),
      },
      {
        accessorFn: (row) => row.users,
        id: "users",
        enableSorting: true,
        header: () => "Пользователей",
        cell: (info) => {
          return (
            <div className="">
              <div>{info.row.original.users}</div>
            </div>
          );
        },
        meta: getStickyMeta(
          "users",
          "min-w-[156px]",
          "text-gray-800 font-normal"
        ),
      },
      {
        accessorFn: (row) => row.active_connections,
        id: "active_connections",
        enableSorting: true,
        header: () => "Активные подкл.",
        cell: (info) => {
          return (
            <div className="min-w-[166px]">
              <div>{info.row.original.active_connections}</div>
            </div>
          );
        },
        meta: getStickyMeta(
          "active_connections",
          "",
          "text-gray-800 font-normal"
        ),
      },
      {
        accessorFn: (row) => row.traffic,
        id: "traffic",
        header: () => "Трафик, Тб.",
        enableSorting: true,
        cell: (info) => {
          return (
            <div className="min-w-[132px]">
              <div>{info.row.original.traffic}</div>
            </div>
          );
        },
        meta: getStickyMeta("traffic", "", "text-gray-800 font-normal"),
      },
      {
        accessorFn: (row) => row.cpu_load_avg_percent,
        id: "cpu_load_avg_percent",
        header: () => "Ср. загр. CPU %",
        enableSorting: true,
        cell: (info) => {
          return (
            <div className="min-w-[156px]">
              <div>
                {info.row.original.cpu_load_avg_percent}{" "}
                <span className="text-[#99A1B7] text-[14px]">%</span>
              </div>
            </div>
          );
        },
        meta: getStickyMeta(
          "cpu_load_avg_percent",
          "",
          "text-gray-800 font-normal"
        ),
      },
      {
        accessorFn: (row) => row.ram_load_avg_percent,
        id: "ram_load_avg_percent",
        header: () => "Ср. загр. RAM %",
        enableSorting: true,
        cell: (info) => {
          return (
            <div className="min-w-[157px]">
              <div>
                {info.row.original.ram_load_avg_percent}{" "}
                <span className="text-[#99A1B7] text-[14px]">%</span>
              </div>
            </div>
          );
        },
        meta: getStickyMeta(
          "ram_load_avg_percent",
          "",
          "text-gray-800 font-normal"
        ),
      },
      // {
      //   accessorFn: (row) => row.uptime_percent,
      //   id: "uptime_percent",
      //   header: () => "Аптайм %",
      //   enableSorting: true,
      //   cell: (info) => {
      //     return (
      //       <div className="min-w-[120px]">
      //         <div>
      //           {info.row.original.uptime_percent}{" "}
      //           <span className="text-[#99A1B7] text-[14px]">%</span>
      //         </div>
      //       </div>
      //     );
      //   },
      //   meta: getStickyMeta("uptime_percent", "", "text-gray-800 font-normal"),
      // },
      {
        accessorFn: (row) => row.speed_avg_mbps,
        id: "speed_avg_mbps",
        header: () => "Ср. скор, Мбит/с",
        enableSorting: true,
        cell: (info) => {
          return (
            <div className="min-w-[165px]">
              <div>{info.row.original.speed_avg_mbps}</div>
            </div>
          );
        },
        meta: getStickyMeta("speed_avg_mbps", "", "text-gray-800 font-normal"),
      },
      // {
      //   accessorFn: (row) => row.errors,
      //   id: "errors",
      //   header: () => "Ошибки",
      //   enableSorting: true,
      //   cell: (info) => {
      //     return (
      //       <div className="min-w-[109px]">
      //         <div>{info.row.original.errors}</div>
      //       </div>
      //     );
      //   },
      //   meta: getStickyMeta("errors", "", "text-gray-800 font-normal"),
      // },
      {
        accessorFn: (row) => row.last_reboot,
        id: "last_reboot",
        header: () => "Дата перезагрузки",
        enableSorting: true,
        cell: (info) => {
          const value = info.row.original.last_reboot;
          return (
            <div className="min-w-[179px]">
              <div>{value ? dayjs(value).format("DD.MM.YYYY") : "—"}</div>
            </div>
          );
        },
        meta: getStickyMeta("last_reboot", "", "text-gray-800 font-normal"),
      },
      {
        accessorFn: (row) => row.config_updated_at,
        id: "config_updated_at",
        header: () => "Обновление конф.",
        enableSorting: true,
        cell: (info) => {
          const value = info.row.original.config_updated_at;
          return (
            <div className="min-w-[175px]">
              <div>{value ? dayjs(value).format("DD.MM.YYYY") : "—"}</div>
            </div>
          );
        },
        meta: getStickyMeta(
          "config_updated_at",
          "",
          "text-gray-800 font-normal"
        ),
      },
      {
        accessorFn: (row) => row.settings,
        id: "settings",
        header: () => "Настройки",
        cell: (info) => {
          return (
            <div className="flex items-center justify-center">
              <button className="ki-filled text-[x-large] text-primary">
                <KeenIcon icon={"setting-2"} />
              </button>
              {info.row.original.settings}
            </div>
          );
        },
        meta: getStickyMeta(
          "settings",
          "w-[170px] cursor-pointer",
          "text-gray-800 font-normal"
        ),
      },
    ],
    [stickyColumnId]
  );

  const data = useMemo(
    () => newListServers?.items || servers,
    [newListServers, servers]
  );

  // Обработчик тумблера "Все"
  const allEnabled = visibleColumns.length === columnOptions.length;
  const handleToggleAll = (checked) => {
    setVisibleColumns(checked ? columnOptions.map((col) => col.id) : []);
  };
  // Обработчик тумблера для одной колонки
  const handleToggleColumn = (id) => {
    setVisibleColumns((prev) =>
      prev.includes(id) ? prev.filter((colId) => colId !== id) : [...prev, id]
    );
  };
  // Обработчик выбора sticky-столбца
  const handleStickyChange = (id) => {
    setStickyColumnId(id);
    if (!visibleColumns.includes(id)) {
      setVisibleColumns((prev) => [...prev, id]);
    }
  };
  // Сохранение настроек
  const handleSaveSettings = () => {
    setIsSettingsModalOpen(false);
  };

  // Фильтруем колонки по visibleColumns
  const filteredColumns = useMemo(
    () => columns.filter((col) => visibleColumns.includes(col.id)),
    [columns, visibleColumns]
  );
  const mainColumns = useMemo(
    () => filteredColumns.filter((col) => col.id !== stickyColumnId),
    [filteredColumns, stickyColumnId]
  );
  const stickyColumn = useMemo(
    () => filteredColumns.find((col) => col.id === stickyColumnId),
    [filteredColumns, stickyColumnId]
  );
  const stickyColumns = stickyColumn ? [stickyColumn] : [];

  // Spacer column for right offset under sticky column
  const spacerColumn = {
    id: "spacer",
    header: () => null,
    cell: () => <div />,
    meta: {
      className: "spacer-col",
      cellClassName: "spacer-col",
    },
  };
  const mainColumnsWithSpacer = [...mainColumns, spacerColumn];

  // Синхронизация вертикального скролла
  useEffect(() => {
    const main = mainTableRef.current;
    const sticky = stickyTableRef.current;
    if (!main || !sticky) return;
    const onScroll = () => {
      sticky.scrollTop = main.scrollTop;
    };
    main.addEventListener("scroll", onScroll);
    return () => main.removeEventListener("scroll", onScroll);
  }, [mainTableRef, stickyTableRef, servers, stickyColumnId]);

  return (
    <div className="px-6">
      <div className="flex justify-between items-center pb-4">
        <h1 className="text-2xl lg:text-3xl font-bold leading-none text-gray-900">
          Серверы и конфигурации
        </h1>
      </div>

      {/* Модалка настроек таблицы */}
      <Modal
        open={isSettingsModalOpen}
        onCancel={() => setIsSettingsModalOpen(false)}
        footer={null}
        width={438}
        closeIcon={
          <span style={{ fontSize: 20, color: "#99A1B7" }}>&#10005;</span>
        }
        bodyStyle={{ padding: 0 }}
        style={{ borderRadius: 12, overflow: "hidden" }}
      >
        <div style={{ padding: 24, paddingBottom: 0 }}>
          <div
            style={{ display: "flex", alignItems: "center", marginBottom: 16 }}
          >
            <span style={{ fontWeight: 600, fontSize: 16 }}>
              Настройка отображения метрик
            </span>
          </div>
          {/* Тумблер "Все" */}
          <div
            style={{ display: "flex", alignItems: "center", marginBottom: 8 }}
          >
            <Switch
              checked={allEnabled}
              onChange={handleToggleAll}
              style={{ marginRight: 12 }}
            />
            <span style={{ fontWeight: 500, fontSize: 16, flex: 1 }}>Все</span>
            {/* <span style={{ width: 24 }} /> */}
            <span className="text-[#071437] text-[12px] w-[110px] text-end leading-tight">
              Фикс. колонки при горизонт. скролле
            </span>
          </div>
          <div style={{ borderTop: "1px solid #F1F1F4", marginBottom: 8 }} />
          {/* Список колонок */}
          {columnOptions.map((col) => {
            const disabled = col.id === "payments"; // пример: "Платежи" выключен
            return (
              <div>
                <div
                  key={col.id}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    // marginBottom: 8,
                    opacity: disabled ? 0.5 : 1,
                    paddingTop: 16,
                    paddingBottom: 16,
                  }}
                >
                  <Switch
                    checked={visibleColumns.includes(col.id)}
                    onChange={() => handleToggleColumn(col.id)}
                    disabled={disabled}
                    style={{ marginRight: 12 }}
                    className="wide-switch"
                  />
                  <span style={{ fontWeight: 500, fontSize: 16, flex: 1 }}>
                    {col.label}
                  </span>
                  <Radio
                    style={{ transform: "scale(1.375)" }}
                    checked={stickyColumnId === col.id}
                    onChange={() => handleStickyChange(col.id)}
                    disabled={disabled || !visibleColumns.includes(col.id)}
                  />
                </div>
                <div style={{ borderTop: "1px solid #F1F1F4" }} />
              </div>
            );
          })}
          <div style={{ marginTop: 24, marginBottom: 8 }}>
            <button
              className="btn btn-primary w-full flex items-center justify-center"
              style={{ height: 44, fontSize: 16, fontWeight: 500 }}
              onClick={handleSaveSettings}
              type="button"
            >
              Сохранить
            </button>
          </div>
        </div>
      </Modal>

      <ServersFilterTable />

      <div className="card card-grid grid h-full min-w-full mt-4 rounded-xl">
        <div className="card-header flex items-center justify-between">
          <h3 className="card-title">Список серверов</h3>
          <div
            className="flex items-center gap-[5px] border border-[#DBDFE9] rounded-md px-3 py-[7px] cursor-pointer"
            onClick={() => setIsSettingsModalOpen(true)}
          >
            <KeenIcon icon="setting-2" className="text-[#99A1B7] text-[18px]" />
            <span className="text-[13px] font-medium text-[#4B5675]">
              Настройки таблицы
            </span>
          </div>
        </div>
        <div className="relative w-full">
          {/* Основная таблица без sticky-столбца */}
          <div
            style={{
              position: "relative",
              overflowX: "auto",
              overflowY: "visible",
              width: "100%",
            }}
          >
            <DataGrid
              key={`${JSON.stringify(filterOptions)}-${refreshCounter}`}
              columns={mainColumnsWithSpacer}
              rowSelect={true}
              serverSide={true}
              pagination={{
                size,
                page: activePage || 0,
                pageCount: totalPages || 1,
                onPageChange: setActivePage,
              }}
              filters={filterOptions}
              onFetchData={fetchServers}
              data={servers}
            />
          </div>
          {/* sticky-столбец справа */}
          {stickyColumn && (
            <div
              style={{
                position: "absolute",
                top: 0,
                right: 0,
                width: 180,
                minWidth: 180,
                maxWidth: 180,
                // height: "100%",
                background: "#fff",
                boxShadow: "-2px 0 4px -2px rgba(0,0,0,0.04)",
                zIndex: 20,
                borderLeft: "1px solid #eee",
                pointerEvents: "none", // чтобы не мешать скроллу основной таблицы
                display: "flex",
                flexDirection: "column",
              }}
            >
              {/* Заголовок */}
              <div
                style={{
                  height: 42,
                  display: "flex",
                  alignItems: "center",
                  borderBottom: "1px solid #eee",
                  fontWeight: 400,
                  fontSize: 14,
                  paddingLeft: 16,
                }}
              >
                {typeof stickyColumn.header === "function"
                  ? stickyColumn.header()
                  : stickyColumn.header}
              </div>
              {/* Ячейки */}
              {servers.map((row, idx) => (
                <div
                  key={idx}
                  style={{
                    height: 49,
                    display: "flex",
                    alignItems: "center",
                    borderBottom: "1px solid #f5f5f5",
                    paddingLeft: 16,
                    fontWeight: 400,
                    color: "#222",
                  }}
                >
                  {typeof stickyColumn.cell === "function"
                    ? stickyColumn.cell({ row: { original: row } })
                    : row[stickyColumn.id]}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
