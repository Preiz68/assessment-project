"use client";
import {
  Calendar,
  User,
  BarChart3,
  Rss,
  Users,
  ShoppingBag,
  MessageSquare,
  ShieldCheck,
  LogOut,
  ChevronDown,
  Menu,
} from "lucide-react";
import { cn } from "@/lib/utils/cn";

const navItems = [
  { icon: Calendar, label: "Turf Booking" },
  { icon: User, label: "My Turf" },
  { icon: BarChart3, label: "Reports" },
  { icon: Rss, label: "My Feed" },
  { icon: Users, label: "Coaching" },
  {
    icon: ShoppingBag,
    label: "Ecommerce",
    subItems: ["Product Listing", "My Orders"],
    active: true,
  },
  { icon: Calendar, label: "Events" },
  { icon: MessageSquare, label: "My Contacts" },
  { icon: Users, label: "Partners" },
  { icon: ShieldCheck, label: "Privacy Policy" },
];

export const Sidebar = () => {
  return (
    <aside className="w-64 bg-white border-r border-[#EAEAEA] min-h-screen flex flex-col fixed left-0 top-0">
      <div className="p-6">
        <div className="flex items-center gap-2 font-bold text-lg mb-8">
          <Menu className="w-5 h-5 text-[#273C8A]" />
          <span className="text-[#A1001A]">PARTNER APP</span>
        </div>

        <nav className="space-y-1">
          {navItems.map((item) => (
            <div key={item.label}>
              <button
                className={cn(
                  "w-full flex items-center justify-between px-3 py-2 text-sm font-medium rounded-md transition-colors",
                  item.active
                    ? "text-[#A1001A]"
                    : "text-gray-600 hover:bg-gray-50"
                )}
              >
                <div className="flex items-center gap-3">
                  <item.icon className="w-4 h-4" />
                  {item.label}
                </div>
                {item.subItems && (
                  <ChevronDown
                    className={cn(
                      "w-4 h-4 transition-transform",
                      item.active && "rotate-180"
                    )}
                  />
                )}
              </button>

              {item.subItems && (
                <div className="mt-1 ml-9 flex flex-col gap-1 border-l pl-3">
                  {item.subItems.map((sub) => (
                    <button
                      key={sub}
                      className={cn(
                        "text-xs py-1.5 text-left transition-colors",
                        sub === "Product Listing"
                          ? "text-[#A1001A] bg-red-50 px-2 rounded font-semibold"
                          : "text-gray-500 hover:text-gray-900"
                      )}
                    >
                      {sub}
                    </button>
                  ))}
                </div>
              )}
            </div>
          ))}
        </nav>
      </div>

      <div className="mt-auto p-6 border-t border-[#EAEAEA]">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-gray-200 overflow-hidden">
            <img
              src="https://api.dicebear.com/7.x/avataaars/svg?seed=Fenil"
              alt="Avatar"
              className="w-full h-full object-cover"
            />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-xs font-semibold text-gray-900 truncate">
              Fenil Shilodre
            </p>
            <p className="text-[10px] text-gray-500 truncate">Venue Owner</p>
          </div>
          <button className="text-gray-400 hover:text-gray-600">
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>
    </aside>
  );
};
