import React, { useContext, useEffect, useState } from "react";
import { Select, Input } from "antd";
import { KeenIcon } from "@/components";
import { FilterContext } from "@/providers/FilterProvider";

const UserTransactionFilters = () => {
  const { filterOptions, addFilter, removeFilter, clearFilters } =
    useContext(FilterContext);

  // Состояния для фильтров
  const [status, setStatus] = useState("all");
  const [amountFrom, setAmountFrom] = useState("");
  const [amountTo, setAmountTo] = useState("");
  const [type, setType] = useState("all");
  const [method, setMethod] = useState("all");
  const [currency, setCurrency] = useState([]);
  const [gateway, setGateway] = useState("all");

  // Опции для селектов
  const statusOptions = [
    { label: "Все", value: "all" },
    { label: "Успешно", value: "success" },
    { label: "Ошибка", value: "error" },
    { label: "В обработке", value: "pending" },
  ];

  const typeOptions = [
    { label: "Все", value: "all" },
    { label: "Пополнение", value: "deposit" },
    { label: "Списание", value: "withdrawal" },
    { label: "Возврат", value: "refund" },
  ];

  const methodOptions = [
    { label: "Все", value: "all" },
    { label: "Банковская карта", value: "card" },
    { label: "Электронный кошелек", value: "wallet" },
    { label: "Криптовалюта", value: "crypto" },
  ];

  const currencyOptions = [
    { label: "RUR", value: "RUR" },
    { label: "USD", value: "USD" },
    { label: "EUR", value: "EUR" },
    { label: "CNY", value: "CNY" },
  ];

  const gatewayOptions = [
    { label: "Все", value: "all" },
    { label: "Stripe", value: "stripe" },
    { label: "PayPal", value: "paypal" },
    { label: "Crypto", value: "crypto" },
  ];

  useEffect(() => {
    clearFilters();
  }, []);

  const handleApplyFilters = () => {
    // Удаляем все предыдущие фильтры
    removeFilter("status");
    removeFilter("min_amount");
    removeFilter("max_amount");
    removeFilter("type");
    removeFilter("method");
    removeFilter("currency");
    removeFilter("gateway");

    // Добавляем новые фильтры
    if (status !== "all") {
      addFilter("status", status);
    }

    if (amountFrom !== "") {
      addFilter("min_amount", amountFrom);
    }

    if (amountTo !== "") {
      addFilter("max_amount", amountTo);
    }

    if (type !== "all") {
      addFilter("type", type);
    }

    if (method !== "all") {
      addFilter("method", method);
    }

    if (currency.length > 0) {
      addFilter("currency", currency.join(","));
    }

    if (gateway !== "all") {
      addFilter("gateway", gateway);
    }
  };

  const handleResetFilters = () => {
    setStatus("all");
    setAmountFrom("");
    setAmountTo("");
    setType("all");
    setMethod("all");
    setCurrency([]);
    setGateway("all");
    clearFilters();
  };

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        handleApplyFilters();
      }}
      className="mb-4"
    >
      <div className="flex flex-col w-full gap-4">
        {/* Первая строка фильтров */}
        <div className="flex flex-col lg:flex-row gap-4 w-full">
          {/* Статус */}
          <div className="w-[382px] relative">
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
              options={statusOptions}
              value={status}
              onChange={setStatus}
              style={{ width: "100%" }}
            />
          </div>
          <div className="flex gap-1">
            {/* Сумма пополнения от */}
            <div className="w-[181.5px] relative">
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
                Сумма пополнения от
              </label>
              <Input
                placeholder="0"
                className="input w-full"
                value={amountFrom}
                onChange={(e) => setAmountFrom(e.target.value)}
                style={{ paddingLeft: "12px", paddingRight: "12px" }}
              />
            </div>

            {/* Разделитель */}
            <div className="flex items-center justify-center">
              <span className="text-[11px]">—</span>
            </div>

            {/* Сумма пополнения до */}
            <div className="w-[181.5px] relative">
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
                до
              </label>
              <Input
                placeholder="0"
                className="input w-full"
                value={amountTo}
                onChange={(e) => setAmountTo(e.target.value)}
                style={{ paddingLeft: "12px", paddingRight: "12px" }}
              />
            </div>
          </div>

          {/* Тип */}
          <div className="w-[382px] relative">
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
              Тип
            </label>
            <Select
              className="input ps-0 pe-0 border-none"
              options={typeOptions}
              value={type}
              onChange={setType}
              style={{ width: "100%" }}
            />
          </div>

          {/* Способ */}
          <div className="w-[382px] relative">
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
              Способ
            </label>
            <Select
              className="input ps-0 pe-0 border-none"
              options={methodOptions}
              value={method}
              onChange={setMethod}
              style={{ width: "100%" }}
            />
          </div>
        </div>

        {/* Вторая строка фильтров */}
        <div className="flex flex-col lg:flex-row gap-4 w-full">
          {/* Валюта */}
          <div className="w-[382px] relative">
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
              Валюта
            </label>
            <Select
              mode="multiple"
              className="input ps-0 pe-0 border-none"
              options={currencyOptions}
              value={currency}
              onChange={setCurrency}
              style={{ width: "100%" }}
              placeholder="Выберите валюты"
            />
          </div>

          {/* Шлюз */}
          <div className="w-[382px] relative">
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
              Шлюз
            </label>
            <Select
              className="input ps-0 pe-0 border-none"
              options={gatewayOptions}
              value={gateway}
              onChange={setGateway}
              style={{ width: "100%" }}
            />
          </div>

          {/* Кнопки */}
          <div className="flex gap-4 items-end">
            <button
              type="button"
              className="btn btn-danger btn-outline transition-all duration-300 flex items-center gap-2 w-[183px] justify-center"
              onClick={handleResetFilters}
            >
              <KeenIcon icon="filter-tick" />
              Сбросить
            </button>
            <button
              type="submit"
              className="btn btn-primary btn-outline transition-all duration-300 flex items-center gap-2 w-[183px] justify-center"
            >
              <KeenIcon icon="filter-tick" />
              Применить
            </button>
          </div>
        </div>
      </div>
    </form>
  );
};

export { UserTransactionFilters };
