import React, {
  useContext,
  useEffect,
  useState,
  useRef,
  useCallback,
} from "react";
import { KeenIcon } from "../../components/keenicons";
import { Selector } from "../../components/selector/selectot";
// import { Input } from "../../components/input/input";
import { ServersFilterContext } from "../../providers/ServersFilterProvider";
import {
  countryFlagMap,
  countryNamesRu,
} from "./blocks/serversContent/ServersContent";
import axios from "axios";
import { BASE_URL } from "../../static";
import { DatePicker, Select, InputNumber, Input } from "antd";
const { RangePicker } = DatePicker;
const { Option } = Select;
import dayjs from "../dashboard/dayjsConfig";
import { ChevronUp, ChevronDown } from "lucide-react";
import { FlexibleDateTimePicker } from "../../components/FlexibleDateTimePicker/FlexibleDateTimePicker";
import { CustomDateRangePicker } from "../dashboard/blocks/CustomRangePicker";

export const ServersFilterTable = ({ onApplyFilters, onResetFilters }) => {
  const {
    filterOptions,
    addFilter,
    removeFilter,
    updateServersList,
    clearFilters,
  } = useContext(ServersFilterContext);

  const [windowSize, setWindowSize] = useState(window.innerWidth);
  const [filter, setFilter] = useState({});
  const [search, setSearch] = useState("");
  const [giveawaysData, setGiveawaysData] = useState([]);
  const [tasksData, setTasksData] = useState([]);
  const [partnerEmail, setPartnerEmail] = useState();
  const [domain, setDomain] = useState("");
  const [valueMin, setValueMin] = useState(null);
  const [valueMax, setValueMax] = useState(null);
  const [dateRange, setDateRange] = useState([]);
  const [selectedGiveaway, setSelectedGiveaway] = useState(null); // "Все"
  const [selectedSubscription, setSelectedSubscription] = useState(null); // "Все"
  const [selectedCogort, setSelectedCogort] = useState(null); // "Все"
  const [selectedTask, setSelectedTask] = useState(null); // "Все"
  const [selectedPartner, setSelectedPartner] = useState(null); // "Все"
  const [filterTableVisible, setFilterTableVisible] = useState(true);

  // === Моковые данные для фильтров ===
  const countryOptions = [
    { label: "Все страны", value: "" },
    ...Object.entries(countryFlagMap).map(([code]) => ({
      label: countryNamesRu[code] || code,
      value: code,
    })),
  ];
  const statusOptions = [
    { label: "Все", value: "" },
    { label: "Онлайн", value: "online" },
    { label: "Офлайн", value: "offline" },
    { label: "Перегружен (CPU)", value: "overloaded_cpu" },
    { label: "Перегружен (RAM)", value: "overloaded_ram" },
    { label: "Перегружен (трафик)", value: "overloaded_traffic" },
  ];
  const cpuOptions = [
    { label: "0–30 %", value: "0-30" },
    { label: "30–60 %", value: "30-60" },
    { label: "60–100 %", value: "60-100" },
  ];
  const ramOptions = [
    { label: "0–30 %", value: "0-30" },
    { label: "30–60 %", value: "30-60" },
    { label: "60–100 %", value: "60-100" },
  ];
  const trafficOptions = [
    { label: "0–1 ТБ", value: "0-1" },
    { label: "1–10 ТБ", value: "1-10" },
    { label: ">10 ТБ", value: ">10" },
  ];
  const uptimeOptions = [
    { label: "от 0 до месяца", value: "0-1m" },
    { label: "более месяца", value: ">1m" },
  ];

  useEffect(() => {
    const handleResize = () => {
      setWindowSize(window.innerWidth);
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Удаляем useEffect для getGiveaways и getTasks, а также связанные состояния giveawaysData и tasksData

  // useEffect(() => {
  //   const getGiveaways = async () => {
  //     try {
  //       const response = await axios.get(`${BASE_URL}/giveaways/`, {
  //         headers: {
  //           Authorization: `Bearer ${localStorage.getItem("admin_token")}`,
  //         },
  //         params: {
  //           page: 1,
  //           per_page: 1000,
  //         },
  //       });
  //       setGiveawaysData(response.data.items);
  //       console.log("getGiveaways", response.data.items);
  //     } catch (error) {
  //       console.error("Error fetching giveaways:", error);
  //     }
  //   };
  //   getGiveaways();
  // }, []);

  const handleFilterOption = () => {
    // Удаляем старые значения фильтров
    removeFilter("partner_email");
    removeFilter("cohort");
    removeFilter("min_balance");
    removeFilter("max_balance");
    removeFilter("datetime_start");
    removeFilter("datetime_end");

    // Добавляем только если есть значения
    if (partnerEmail !== null && partnerEmail !== "") {
      addFilter("partner_email", partnerEmail);
    }

    if (domain !== null && domain !== "") {
      addFilter("cohort", domain);
    }

    if (valueMin !== null && valueMin !== "") {
      addFilter("min_balance", valueMin);
    }

    if (valueMax !== null && valueMax !== "") {
      addFilter("max_balance", valueMax);
    }

    if (dateRange.length === 2 && dateRange[0] && dateRange[1]) {
      addFilter("datetime_start", dateRange[0].format("YYYY-MM-DD HH:mm:ss"));
      addFilter("datetime_end", dateRange[1].format("YYYY-MM-DD HH:mm:ss"));
    }

    // В итоге отправляем один раз список всех активных фильтров
    setTimeout(() => {
      updateServersList(filterOptions);
    }, 0);
  };

  useEffect(() => {
    // Очистим фильтры в провайдере, как только компонент монтируется:
    clearFilters();

    // Сброс локальных полей:
    setPartnerEmail("");
    setDomain("");
    setValueMin(null);
    setValueMax(null);
    // (если ещё есть dateRange или другие поля, можно их тоже сбросить здесь,
    //  но раз вы сказали, что трогать остальные не нужно, опустим)

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Определяем тип отображения на основе размера экрана
  const isMobile = windowSize > 480 && windowSize < 780;
  const isSmallMobile = windowSize < 480;

  // const debounceTimeout = useRef(null);

  // const debounceUpdate = useCallback(
  //   (newFilters) => {
  //     if (debounceTimeout.current) {
  //       clearTimeout(debounceTimeout.current);
  //     }
  //     debounceTimeout.current = setTimeout(() => {
  //       updateStatisticList(newFilters);
  //     }, 1500); // 500ms задержка
  //   },
  //   [updateStatisticList]
  // );
  const partnerEmailRef = useRef();
  const domainRef = useRef();
  const valueMinRef = useRef();
  const valueMaxRef = useRef();

  const debounceRef = useRef(null);

  const scheduleDebouncedUpdate = () => {
    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
    }

    debounceRef.current = setTimeout(() => {
      const partner = partnerEmailRef.current?.trim();
      const domainVal = domainRef.current?.trim();
      const minBal = valueMinRef.current;
      const maxBal = valueMaxRef.current;

      // 1) Сбрасываем старые фильтры:
      removeFilter("partner_email");
      removeFilter("cohort");
      removeFilter("min_balance");
      removeFilter("max_balance");

      // 2) Если поле непустое, снова добавляем:
      if (partner) addFilter("partner_email", partner);
      if (domainVal) addFilter("cohort", domainVal);
      if (minBal != null && minBal !== "") addFilter("min_balance", minBal);
      if (maxBal != null && maxBal !== "") addFilter("max_balance", maxBal);

      // ❌ УДАЛЕНО: Не вызываем updateStatisticList здесь! ❌
      //    DataGrid сам отреагирует, потому что prop `filters` = filterOptions поменялся.
    }, 500); // или 1500 ms — как вам удобнее
  };

  // const handlePartnerChange = (e) => {
  //   const value = e.target.value;
  //   setPartnerEmail(value);
  //   if (value !== "") {
  //     addFilter("partner_email", value);
  //   } else {
  //     removeFilter("partner_email");
  //   }

  //   debounceUpdate({ ...filterOptions, partner_email: value });
  // };

  // const handleCohortChange = (e) => {
  //   const value = e.target.value;
  //   setCohort(value);
  //   if (value !== "") {
  //     addFilter("cohort", value);
  //   } else {
  //     removeFilter("cohort");
  //   }

  //   debounceUpdate({ ...filterOptions, cohort: value });
  // };

  // const handleMinBalanceChange = (value) => {
  //   if (value !== "") {
  //     addFilter("min_balance", value);
  //   } else {
  //     removeFilter("min_balance");
  //   }

  //   debounceUpdate({ ...filterOptions, min_balance: value });
  // };

  // const handleMaxBalanceChange = (value) => {
  //   if (value !== "") {
  //     addFilter("max_balance", value);
  //   } else {
  //     removeFilter("max_balance");
  //   }

  //   debounceUpdate({ ...filterOptions, max_balance: value });
  // };

  // Обработчики ввода:
  const handleDomainChange = (e) => {
    setDomain(e.target.value);
    domainRef.current = e.target.value;
    scheduleDebouncedUpdate();
  };

  const handlePartnerChange = (e) => {
    const v = e.target.value;
    setPartnerEmail(v);
    partnerEmailRef.current = v;
    scheduleDebouncedUpdate();
  };

  const handleMinBalanceChange = (v) => {
    setValueMin(v);
    valueMinRef.current = v;
    scheduleDebouncedUpdate();
  };

  const handleMaxBalanceChange = (v) => {
    setValueMax(v);
    valueMaxRef.current = v;
    scheduleDebouncedUpdate();
  };

  const [tempDateRange, setTempDateRange] = useState();
  const [fromTime, setFromTime] = useState("00:00");
  const [toTime, setToTime] = useState("00:00");
  const [isOpen, setIsOpen] = useState(false);

  const handleDateRangeApply = () => {
    if (tempDateRange?.from && tempDateRange?.to) {
      const [fh, fm] = fromTime.split(":").map(Number);
      const [th, tm] = toTime.split(":").map(Number);

      const from = dayjs(tempDateRange.from).hour(fh).minute(fm);
      const to = dayjs(tempDateRange.to).hour(th).minute(tm);

      setDateRange([from, to]);
      setIsOpen(false);

      const formattedStart = from.format("YYYY-MM-DD HH:mm");
      const formattedEnd = to.format("YYYY-MM-DD HH:mm");

      // addFilter("datetime_start", formattedStart); // Удалено
      // addFilter("datetime_end", formattedEnd); // Удалено

      // updateStatisticList({ // Удалено
      //   ...filterOptions, // Удалено
      //   datetime_start: formattedStart, // Удалено
      //   datetime_end: formattedEnd, // Удалено
      // }); // Удалено
    }
  };

  const handleDateRangeReset = () => {
    setTempDateRange(undefined); // сброс временных
    setFromTime("00:00");
    setToTime("00:00");
    setDateRange([]); // ⬅️ сброс основного значения

    removeFilter("datetime_start"); // сброс фильтров
    removeFilter("datetime_end");

    // updateStatisticList({ // Удалено
    //   ...filterOptions, // Удалено
    //   datetime_start: undefined, // Удалено
    //   datetime_end: undefined, // Удалено
    // }); // Удалено

    setIsOpen(false); // ⬅️ закрытие поповера, если требуется
  };

  // ДОБАВИТЬ отдельные состояния для каждого фильтра:
  const [selectedCountry, setSelectedCountry] = useState(null);
  const [selectedStatus, setSelectedStatus] = useState(null);
  const [selectedCpu, setSelectedCpu] = useState(null);
  const [selectedRam, setSelectedRam] = useState(null);
  const [selectedTraffic, setSelectedTraffic] = useState(null);
  const [selectedUptime, setSelectedUptime] = useState(null);

  const handleApply = () => {
    // Удаляем все возможные фильтры
    removeFilter("status");
    removeFilter("country");
    removeFilter("min_cpu");
    removeFilter("max_cpu");
    removeFilter("min_ram");
    removeFilter("max_ram");
    removeFilter("min_traffic");
    removeFilter("max_traffic");
    removeFilter("uptime");
    removeFilter("domain");
    removeFilter("date_from");
    removeFilter("date_to");

    // Добавляем новые фильтры
    if (selectedStatus) addFilter("status", selectedStatus);
    if (selectedCountry) addFilter("country", selectedCountry);
    if (typeof selectedCpu === "string" && selectedCpu.includes("-")) {
      const [min, max] = selectedCpu
        .split("-")
        .map((s) => s.replace(/[^0-9]/g, ""));
      if (min) addFilter("min_cpu", Number(min));
      if (max) addFilter("max_cpu", Number(max));
    }
    if (typeof selectedRam === "string" && selectedRam.includes("-")) {
      const [min, max] = selectedRam
        .split("-")
        .map((s) => s.replace(/[^0-9]/g, ""));
      if (min) addFilter("min_ram", Number(min));
      if (max) addFilter("max_ram", Number(max));
    }
    if (typeof selectedTraffic === "string") {
      if (selectedTraffic.startsWith(">")) {
        const min = selectedTraffic.replace(/[^0-9]/g, "");
        if (min) addFilter("min_traffic", Number(min));
      } else if (selectedTraffic.includes("-")) {
        const [min, max] = selectedTraffic
          .split("-")
          .map((s) => s.replace(/[^0-9]/g, ""));
        if (min) addFilter("min_traffic", Number(min));
        if (max) addFilter("max_traffic", Number(max));
      }
    }
    if (selectedUptime) addFilter("uptime", selectedUptime);
    if (domain) addFilter("domain", domain);
    if (dateRange && dateRange.length === 2 && dateRange[0] && dateRange[1]) {
      addFilter("date_from", dateRange[0].format("YYYY-MM-DD"));
      addFilter("date_to", dateRange[1].format("YYYY-MM-DD"));
    }

    console.log("Фильтры для отправки:", filterOptions);
    // Вызываем updateServersList без параметров, как в FilterTabel пользователей
    updateServersList();
  };

  const handleReset = () => {
    setSelectedCountry(null);
    setSelectedStatus(null);
    setSelectedCpu(null);
    setSelectedRam(null);
    setSelectedTraffic(null);
    setSelectedUptime(null);
    setDomain("");
    setDateRange([]);
    clearFilters();
    // Вызываем updateServersList без параметров, как в FilterTabel пользователей
    updateServersList();
  };

  return (
    <div style={{ zIndex: "1" }} className="mb-4">
      <div
        className="flex gap-3 items-center text-[#78829D] mt-6"
        onClick={() => setFilterTableVisible(!filterTableVisible)}
      >
        <div>Фильтры</div>
        <div className="border border-[#DBDFE9] w-full h-[1px]"></div>
        <div>
          {filterTableVisible ? (
            <div className="flex gap-1">
              свернуть <ChevronUp />
            </div>
          ) : (
            <div className="flex gap-1">
              развенуть <ChevronDown />
            </div>
          )}
        </div>
      </div>
      <div
        className={`${filterTableVisible === true ? "" : "hidden "}flex flex-col w-full mb-4 gap-5`}
      >
        <div
          className={`mt-5 ${isSmallMobile ? "flex flex-col gap-5" : "flex flex-col sm:flex-row gap-5"}`}
        >
          <div className="sm:w-1/4 relative">
            <div className="block lg:hidden">
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
                Дата и время
              </label>
              <FlexibleDateTimePicker
                mode="range"
                withTime={true}
                value={dateRange}
                onChange={(value) => {
                  setDateRange(value);
                }}
              />
            </div>
            <div className="hidden lg:flex">
              <CustomDateRangePicker
                date={{
                  from: dateRange?.[0]?.toDate?.(),
                  to: dateRange?.[1]?.toDate?.(),
                }}
                setDate={(range) => {
                  if (range?.from && range?.to) {
                    const [fh, fm] = fromTime.split(":").map(Number);
                    const [th, tm] = toTime.split(":").map(Number);

                    const from = dayjs(range.from).hour(fh).minute(fm);
                    const to = dayjs(range.to).hour(th).minute(tm);

                    setDateRange([from, to]);
                  }
                }}
                tempDateRange={tempDateRange}
                setTempDateRange={setTempDateRange}
                fromTime={fromTime}
                setFromTime={setFromTime}
                toTime={toTime}
                setToTime={setToTime}
                isOpen={isOpen}
                setIsOpen={setIsOpen}
                defaultStartDate={dateRange?.[0]?.toDate?.() || new Date()}
                handleDateRangeApply={handleDateRangeApply}
                handleDateRangeReset={handleDateRangeReset}
                labelText="Дата и время"
              />
            </div>
          </div>
          <div className="sm:w-1/4 relative">
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
              Страна
            </label>
            <Select
              className="input ps-0 pe-0 border-none"
              placeholder="Страна"
              value={selectedCountry}
              onChange={setSelectedCountry}
              options={countryOptions}
            />
          </div>
          <div className="sm:w-1/4 relative">
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
              Статус
            </label>
            <Select
              className="input ps-0 pe-0 border-none"
              placeholder="Статус"
              value={selectedStatus}
              onChange={setSelectedStatus}
              options={statusOptions}
            />
          </div>
          <div className="sm:w-1/4 relative">
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
              Диапазон загрузки CPU
            </label>
            <Select
              className="input ps-0 pe-0 border-none"
              placeholder="Диапазон загрузки CPU"
              value={selectedCpu}
              onChange={setSelectedCpu}
              options={cpuOptions}
            />
          </div>
        </div>
        <div
          className={`${isSmallMobile ? "flex flex-col gap-5" : "flex flex-col sm:flex-row gap-5"}`}
        >
          <div className="sm:w-1/3 relative">
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
              Диапазон загрузки RAM
            </label>
            <Select
              className="input ps-0 pe-0 border-none"
              placeholder="Диапазон загрузки RAM"
              value={selectedRam}
              onChange={setSelectedRam}
              options={ramOptions}
            />
          </div>
          <div className="sm:w-1/3 relative">
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
              Диапазон трафика
            </label>
            <Select
              className="input ps-0 pe-0 border-none"
              placeholder="Диапазон трафика"
              value={selectedTraffic}
              onChange={setSelectedTraffic}
              options={trafficOptions}
            />
          </div>
          {/* <div className="sm:w-1/3 relative">
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
              Аптайм
            </label>
            <Select
              className="input ps-0 pe-0 border-none"
              placeholder="Аптайм"
              value={selectedUptime}
              onChange={setSelectedUptime}
              options={uptimeOptions}
            />
          </div> */}
          <div className="sm:w-1/3 relative">
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
              IP адрес / домен
            </label>
            <Input
              size="large"
              className="rounded-md text-sm w-full"
              value={domain}
              onChange={handleDomainChange}
              placeholder="IP адрес или домен"
            />
          </div>
        </div>
        <div className="flex gap-4 text-[13px] font-medium">
          <button
            onClick={handleReset}
            className="bg-[#FFEEF3] text-[#F8285A] w-[183px] h-[40px] flex items-center justify-center rounded-md border border-[#F8285A]/20"
          >
            Сбросить
          </button>
          <button
            onClick={handleApply}
            className="bg-[#EFF6FF] text-[#1B84FF] w-[183px] h-[40px] flex items-center justify-center rounded-md border border-[#1B84FF]/20"
          >
            Применить
          </button>
        </div>
      </div>
    </div>
  );
};
