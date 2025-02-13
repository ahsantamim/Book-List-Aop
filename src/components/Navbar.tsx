'use client';

import { Fragment } from 'react';
import { Disclosure, Menu, Transition } from '@headlessui/react';
import { 
  Bars3Icon, 
  XMarkIcon, 
  BookOpenIcon, 
  UserIcon,
  GlobeAltIcon,
  BookmarkIcon 
} from '@heroicons/react/24/outline';
import { useAuth } from '@/context/auth-context';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import Image from 'next/image';

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(' ');
}

export default function Navbar() {
  const { user, signOut } = useAuth();
  const pathname = usePathname();

  const navigation = [
    { name: 'Books', href: '/books', icon: GlobeAltIcon },
    ...(user ? [{ name: 'My Books', href: '/my-books', icon: BookmarkIcon }] : []),
  ];

  return (
    <Disclosure as="nav" className="bg-white shadow-md">
      {({ open }) => (
        <>
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="flex h-16 justify-between">
              <div className="flex">
                <div className="flex flex-shrink-0 items-center">
                  <Link href="/" className="flex items-center gap-2 text-blue-600 hover:text-blue-700 transition-colors">
                    <BookOpenIcon className="h-8 w-8" />
                    <span className="text-2xl font-bold">BookList</span>
                  </Link>
                </div>
                <div className="hidden sm:ml-8 sm:flex sm:space-x-8">
                  {navigation.map((item) => (
                    <Link
                      key={item.name}
                      href={item.href}
                      className={classNames(
                        pathname === item.href
                          ? 'border-blue-500 text-blue-600'
                          : 'border-transparent text-gray-600 hover:text-blue-500 hover:border-blue-300',
                        'inline-flex items-center gap-2 border-b-2 px-3 pt-1 text-sm font-medium transition-colors duration-200'
                      )}
                    >
                      <item.icon className="h-5 w-5" />
                      {item.name}
                    </Link>
                  ))}
                </div>
              </div>
              <div className="hidden sm:ml-6 sm:flex sm:items-center">
                {user ? (
                  <Menu as="div" className="relative ml-3">
                    <div>
                      <Menu.Button className="flex items-center gap-2 rounded-full bg-white p-1 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2">
                        <span className="sr-only">Open user menu</span>
                        {user.photoURL ? (
                          <Image
                            className="h-8 w-8 rounded-full ring-2 ring-blue-100"
                            src={user.photoURL}
                            alt=""
                            width={32}
                            height={32}
                          />
                        ) : (
                          <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center">
                            <UserIcon className="h-5 w-5 text-blue-600" />
                          </div>
                        )}
                        <span className="text-sm font-medium text-gray-700">{user.email?.split('@')[0]}</span>
                      </Menu.Button>
                    </div>
                    <Transition
                      as={Fragment}
                      enter="transition ease-out duration-200"
                      enterFrom="transform opacity-0 scale-95"
                      enterTo="transform opacity-100 scale-100"
                      leave="transition ease-in duration-75"
                      leaveFrom="transform opacity-100 scale-100"
                      leaveTo="transform opacity-0 scale-95"
                    >
                      <Menu.Items className="absolute right-0 z-10 mt-2 w-48 origin-top-right rounded-xl bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                        <Menu.Item>
                          {({ active }) => (
                            <button
                              onClick={signOut}
                              className={classNames(
                                active ? 'bg-gray-50' : '',
                                'block w-full px-4 py-2 text-left text-sm text-gray-700 hover:text-red-600 transition-colors'
                              )}
                            >
                              Sign out
                            </button>
                          )}
                        </Menu.Item>
                      </Menu.Items>
                    </Transition>
                  </Menu>
                ) : (
                  <Link
                    href="/auth"
                    className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-500 
                             transition-all duration-200 hover:shadow-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                  >
                    Sign in
                  </Link>
                )}
              </div>
              <div className="-mr-2 flex items-center sm:hidden">
                <Disclosure.Button className="inline-flex items-center justify-center rounded-md p-2 text-gray-400 
                                           hover:bg-gray-100 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500">
                  <span className="sr-only">Open main menu</span>
                  {open ? (
                    <XMarkIcon className="block h-6 w-6" aria-hidden="true" />
                  ) : (
                    <Bars3Icon className="block h-6 w-6" aria-hidden="true" />
                  )}
                </Disclosure.Button>
              </div>
            </div>
          </div>

          <Disclosure.Panel className="sm:hidden">
            <div className="space-y-1 pb-3 pt-2">
              {navigation.map((item) => (
                <Disclosure.Button
                  key={item.name}
                  as={Link}
                  href={item.href}
                  className={classNames(
                    pathname === item.href
                      ? 'bg-blue-50 border-blue-500 text-blue-700'
                      : 'border-transparent text-gray-600 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-800',
                    'flex items-center gap-2 border-l-4 py-2 pl-3 pr-4 text-base font-medium transition-colors duration-200'
                  )}
                >
                  <item.icon className="h-5 w-5" />
                  {item.name}
                </Disclosure.Button>
              ))}
            </div>
            <div className="border-t border-gray-200 pb-3 pt-4">
              {user ? (
                <div className="space-y-1">
                  <div className="flex items-center gap-3 px-4 py-2">
                    {user.photoURL ? (
                      <Image
                        className="h-8 w-8 rounded-full ring-2 ring-blue-100"
                        src={user.photoURL}
                        alt=""
                        width={32}
                        height={32}
                      />
                    ) : (
                      <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center">
                        <UserIcon className="h-5 w-5 text-blue-600" />
                      </div>
                    )}
                    <span className="text-sm font-medium text-gray-700">{user.email?.split('@')[0]}</span>
                  </div>
                  <Disclosure.Button
                    as="button"
                    onClick={signOut}
                    className="block w-full px-4 py-2 text-left text-base font-medium text-gray-500 hover:bg-gray-100 
                             hover:text-red-600 transition-colors duration-200"
                  >
                    Sign out
                  </Disclosure.Button>
                </div>
              ) : (
                <div className="px-4">
                  <Disclosure.Button
                    as={Link}
                    href="/auth"
                    className="block w-full rounded-lg bg-blue-600 px-4 py-2 text-center text-base font-medium text-white 
                             hover:bg-blue-500 transition-colors duration-200 shadow-sm hover:shadow-md"
                  >
                    Sign in
                  </Disclosure.Button>
                </div>
              )}
            </div>
          </Disclosure.Panel>
        </>
      )}
    </Disclosure>
  );
}
