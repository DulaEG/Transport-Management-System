import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Icon } from "@iconify/react";
import { Menu, ConfigProvider } from "antd";

function getItem(label, key, icon, children, type) {
    return {
        key,
        icon,
        children,
        label,
        type,
    };
}

const items = [
    getItem("Dashboard", "/dashboard", <Icon icon="material-symbols:dashboard-outline" />),

    getItem("Employee Management", "sub3", <Icon icon="clarity:employee-line" />, [
        getItem("Employees", "/dashboard/employee2"),
    ]),
    getItem("Duty Management", "sub4", <Icon icon="material-symbols:work-outline" />, [
        getItem("Duties", "/dashboard/duty2"),
    ]),
];

const rootSubmenuKeys = ["sub3", "sub4"];

function SideBar() {
    const location = useLocation();
    const navigate = useNavigate();
    const [openKeys, setOpenKeys] = useState(["/admin"]);
    const [selectedKeys, setSelectedKeys] = useState("/admin");

    useEffect(() => {
        const pathName = location.pathname;
        setSelectedKeys(pathName);
    }, [location.pathname]);

    const onOpenChange = (keys) => {
        const latestOpenKey = keys.find((key) => openKeys.indexOf(key) === -1);
        if (latestOpenKey && rootSubmenuKeys.indexOf(latestOpenKey) === -1) {
            setOpenKeys(keys);
        } else {
            setOpenKeys(latestOpenKey ? [latestOpenKey] : []);
        }
    };

    return (
        <div className="bg-[#0071ff] h-[calc(100vh-30px)] w-fit m-[0] p-0 rounded-[8px] flex flex-col justify-start items-center">
            

            <ConfigProvider
                theme={{
                    components: {
                        Menu: {
                            itemColor: "#FFF", // Text color of menu item
                            iconSize: "21px",
                            itemHeight: "50px", // Increase item height to add more gap
                            subMenuItemBg: "#0071ff",
                            itemPadding: "10px 24px", // Customize padding for additional spacing
                            itemSelectedBg: "#00377d", // Background color of selected item
                            itemSelectedColor: "#79b4ff", // Text color of selected item
                        },
                    },
                }}
            >
                <Menu
                    mode="inline"
                    openKeys={openKeys}
                    selectedKeys={[selectedKeys]}
                    onOpenChange={onOpenChange}
                    onClick={(item) => {
                        navigate(item.key);
                    }}
                    style={{
                        width: 256,
                        height: "100%",
                        backgroundColor: "#0071ff", // Ensure menu background is white
                        borderRadius: "8px",
                        fontSize: "16px",
                        fontWeight: "400",
                    }}
                    items={items}
                />
            </ConfigProvider>
        </div>
    );
}

export default SideBar;
