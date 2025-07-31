import { useRef, useState } from "react";
import { KeenIcon } from "@/components/keenicons";
import { toAbsoluteUrl } from "@/utils";
import { Menu, MenuItem, MenuToggle } from "@/components";
import { DropdownUser } from "@/partials/dropdowns/user";
import { DropdownNotifications } from "@/partials/dropdowns/notifications";
import { DropdownApps } from "@/partials/dropdowns/apps";
import { DropdownChat } from "@/partials/dropdowns/chat";
import { ModalSearch } from "@/partials/modals/search/ModalSearch";
import { useLanguage } from "@/i18n";
import { useNavigate } from "react-router";
import { Select as AntSelect } from "antd";
const HeaderTopbar = () => {
  const navigate = useNavigate();
  const { isRTL } = useLanguage();
  const itemChatRef = useRef(null);
  const itemAppsRef = useRef(null);
  const itemUserRef = useRef(null);
  const itemNotificationsRef = useRef(null);
  const handleShow = () => {
    window.dispatchEvent(new Event("resize"));
  };
  const [searchModalOpen, setSearchModalOpen] = useState(false);
  const handleOpen = () => setSearchModalOpen(true);
  const handleClose = () => {
    setSearchModalOpen(false);
  };
  return (
    <div className="flex items-center gap-2 lg:gap-3.5">
      {/* <KeenIcon
        className="text-lg rounded-full hover:bg-primary-light hover:text-primary text-gray-500"
        icon="question-2"
      />
      <KeenIcon
        className="text-lg rounded-full hover:bg-primary-light hover:text-primary text-gray-500"
        icon="notification"
      /> */}
      {/* <button
        onClick={handleOpen}
        className="btn btn-icon btn-icon-lg size-9 rounded-full hover:bg-primary-light hover:text-primary text-gray-500"
      >
        <KeenIcon icon="magnifier" />
      </button>
      <ModalSearch open={searchModalOpen} onClose={handleClose} /> */}

      {/* <Menu>
        <MenuItem
          ref={itemChatRef}
          onShow={handleShow}
          toggle="dropdown"
          trigger="click"
          dropdownProps={{
            placement: isRTL() ? "bottom-start" : "bottom-end",
            modifiers: [
              {
                name: "offset",
                options: {
                  offset: isRTL() ? [-170, 10] : [170, 10],
                },
              },
            ],
          }}
        >
          <MenuToggle className="btn btn-icon btn-icon-lg size-9 rounded-full hover:bg-primary-light hover:text-primary dropdown-open:bg-primary-light dropdown-open:text-primary text-gray-500">
            <KeenIcon icon="messages" />
          </MenuToggle>

          {DropdownChat({
            menuTtemRef: itemChatRef,
          })}
        </MenuItem>
      </Menu>

      <Menu>
        <MenuItem
          ref={itemAppsRef}
          toggle="dropdown"
          trigger="click"
          dropdownProps={{
            placement: isRTL() ? "bottom-start" : "bottom-end",
            modifiers: [
              {
                name: "offset",
                options: {
                  offset: isRTL() ? [10, 10] : [-10, 10],
                },
              },
            ],
          }}
        >
          <MenuToggle className="btn btn-icon btn-icon-lg size-9 rounded-full hover:bg-primary-light hover:text-primary dropdown-open:bg-primary-light dropdown-open:text-primary text-gray-500">
            <KeenIcon icon="element-11" />
          </MenuToggle>

          {DropdownApps()}
        </MenuItem>
      </Menu>

      <Menu>
        <MenuItem
          ref={itemNotificationsRef}
          toggle="dropdown"
          trigger="click"
          dropdownProps={{
            placement: isRTL() ? "bottom-start" : "bottom-end",
            modifiers: [
              {
                name: "offset",
                options: {
                  offset: isRTL() ? [70, 10] : [-70, 10], // [skid, distance]
                },
              },
            ],
          }}
        >
          <MenuToggle className="btn btn-icon btn-icon-lg relative cursor-pointer size-9 rounded-full hover:bg-primary-light hover:text-primary dropdown-open:bg-primary-light dropdown-open:text-primary text-gray-500">
            <KeenIcon icon="notification-status" />
          </MenuToggle>
          {DropdownNotifications({
            menuTtemRef: itemNotificationsRef,
          })}
        </MenuItem>
      </Menu> */}

      {/* <Menu>
        <MenuItem
          ref={itemUserRef}
          toggle="dropdown"
          trigger="click"
          dropdownProps={{
            placement: isRTL() ? "bottom-start" : "bottom-end",
            modifiers: [
              {
                name: "offset",
                options: {
                  offset: isRTL() ? [-20, 10] : [20, 10], // [skid, distance]
                },
              },
            ],
          }}
        >
          <MenuToggle className="btn btn-icon rounded-full">
            <img
              className="size-9 rounded-full border-2 border-success shrink-0"
              src={toAbsoluteUrl("/media/avatars/300-2.png")}
              alt=""
            />
          </MenuToggle>
          {DropdownUser({
            menuItemRef: itemUserRef,
          })}
        </MenuItem>
      </Menu> */}
      {/* <div className="w-full relative">
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
          VPN
        </label>
        <AntSelect
          value={"NativeVPN"}
          className="input ps-0 pe-0 border-none min-[360px]:w-[212px] min-[744px]:w-[382px]"
          options={[
            { label: "NativeVPN", value: "native_vpn" },
            { label: "Другой VPN", value: "other_vpn" }, // показываем как "Регулярная", храним как "trigger"
          ]}
        />
      </div> */}
      <button
        onClick={() => {
          localStorage.removeItem("metronic-tailwind-react-auth-v1=9.1.1");
          navigate("/auth/login");
        }}
      >
        <KeenIcon
          className="text-lg rounded-full hover:bg-primary-light hover:text-primary text-gray-500"
          icon="exit-right"
        />
      </button>
    </div>
  );
};
export { HeaderTopbar };
