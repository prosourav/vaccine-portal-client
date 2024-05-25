import { IRootState } from "@/redux/store";
import Link from "next/link";
import { useRouter } from "next/router";
import React, { useEffect, useRef } from "react";
import { FaUsers } from "react-icons/fa";
import { MdEventAvailable, MdMeetingRoom, MdOutlineReviews, MdOutlineVaccines } from "react-icons/md";
import { PiChatTextFill } from "react-icons/pi";
import { useSelector } from "react-redux";



const Sidebar = () => {

  const { role } = useSelector((state: IRootState)=> state.userStore.mainUser);
  const router = useRouter();
  const currentUrl = router.asPath;


  // sideBarMenuItems
  const asideMenu = [
  {
      key: 'availability',
      name: 'Availability',
      icon: (<MdEventAvailable />
      ),
      href: '/',
  },
  {
    key:'appointment',
    name: 'Appointments',
    icon: (<MdMeetingRoom />),
    href:'/appointment',
  },
  {
    key:'us1b',
    name: 'Users',
    icon: (<FaUsers />
    ),
    href:'/users',
  },
  {
    key:'pr14b',
    name: 'Vaccines',
    icon: (<MdOutlineVaccines />
    ),
    href:'/vaccine',
  },
  {
    key:'pr1b',
    name: 'Feedback',
    icon: <MdOutlineReviews />,
    href:'/feedbacks',
  },
  {
    key:'pr7b',
    name: 'Chat',
    icon:( <PiChatTextFill className='lg' />),
    href:'/chat',
  }
];

  return (
    <aside
      id="default-sidebar"
      className="xl:mt-0 sm:mt-[4.68rem] z-40 w-64 h-screen transition-transform -translate-x-full sm:translate-x-0 hidden xl:block"
      aria-label="Sidebar"
      style={{height: "93vh"}}
    >
      <div className="h-full px-3 py-4 overflow-y-auto bg-green-700 ">
        <ul className="space-y-2 font-medium">
          {asideMenu.map((item) => (
            <li className={`${role == 'user' && (item.name == 'Users' || item.name == 'Vaccines') && "hidden" }`} key={item.key}>
            <Link
              href={item.href}
              className={`flex items-center p-2 rounded-lg ${currentUrl===item.href && 'text-green-900 bg-white'}
               hover:bg-green-100 dark:hover:bg-green-900 group hover:text-green-900`}
            >
              {item.icon}
              <span className="flex-1 ms-3 whitespace-nowrap">{item.name}</span>
            </Link>
          </li>
          ))}
        </ul>
      </div>
    </aside>
  );
};

export default Sidebar;
