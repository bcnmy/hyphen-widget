import { Listbox, Transition } from '@headlessui/react';
import React, { Fragment } from 'react';
import { HiOutlineChevronDown } from 'react-icons/hi';
import { twMerge } from 'tailwind-merge';
import noSelectIcon from 'assets/images/no-select-icon.svg';

export interface Option {
  name: string;
  image?: string;
  id: any;
  disabled?: boolean;
  tooltip?: string;
}
export interface ISelectProps {
  className?: string;
  options: Option[] | undefined;
  selected?: Option;
  setSelected: (option: Option) => void;
  label: string;
  disabled?: boolean;
}

interface IOptionContentProps {
  option: Option;
  active: boolean;
  selected: boolean;
}

const OptionContent: React.FC<IOptionContentProps> = ({
  option,
  active,
  selected,
}) => {
  return (
    <span
      className={`${
        selected ? 'tw-hw-font-medium' : 'tw-hw-font-normal'
      } tw-hw-flex tw-hw-items-center tw-hw-truncate`}
    >
      {option.image ? (
        <img
          className="tw-hw-mr-2 tw-hw-h-4 tw-hw-w-4 md:tw-hw-h-5 md:tw-hw-w-5"
          src={option.image}
          alt={option.name}
        />
      ) : null}
      {option.name}
    </span>
  );
};

export const Select: React.FC<ISelectProps> = ({
  className,
  selected,
  setSelected,
  options,
  label,
  disabled,
}) => {
  return (
    <div className="tw-hw-flex tw-hw-flex-col">
      <Listbox value={selected} onChange={setSelected} disabled={disabled}>
        <Listbox.Label className="tw-hw-mb-2 tw-hw-pl-5 tw-hw-text-xxs tw-hw-font-bold tw-hw-uppercase tw-hw-text-hyphen-gray-400">
          {label}
        </Listbox.Label>
        <div className="tw-hw-relative tw-hw-h-15">
          <Listbox.Button
            className={twMerge(
              className,
              'tw-hw-relative tw-hw-h-full tw-hw-w-full tw-hw-cursor-pointer tw-hw-rounded-2.5 tw-hw-border tw-hw-bg-white tw-hw-py-2 tw-hw-pl-4 tw-hw-pr-6 tw-hw-text-left tw-hw-text-sm tw-hw-text-hyphen-gray-400 focus:tw-hw-outline-none md:tw-hw-pr-10 md:tw-hw-text-base',
              disabled &&
                'tw-hw-cursor-not-allowed tw-hw-bg-gray-200 tw-hw-text-gray-900/80'
            )}
          >
            <span className="tw-hw-flex tw-hw-items-center tw-hw-truncate">
              {selected ? (
                <>
                  {selected.image ? (
                    <img
                      className="tw-hw-mr-2 tw-hw-h-4 tw-hw-w-4 md:tw-hw-h-5 md:tw-hw-w-5"
                      src={selected.image}
                      alt={selected.name}
                    />
                  ) : null}
                  {selected.name}
                </>
              ) : (
                <>
                  <img
                    src={noSelectIcon}
                    alt={`Select ${label}`}
                    className="tw-hw-mr-2 tw-hw-h-4 tw-hw-w-4 md:tw-hw-h-5 md:tw-hw-w-5"
                  />
                  Select {label}
                </>
              )}
            </span>
            <span className="tw-hw-pointer-events-none tw-hw-absolute tw-hw-inset-y-0 tw-hw-right-1 tw-hw-flex tw-hw-items-center tw-hw-pr-2">
              <HiOutlineChevronDown
                className="tw-hw-h-3 tw-hw-w-3 tw-hw-text-gray-400 md:tw-hw-h-4 md:tw-hw-w-4"
                aria-hidden="true"
              />
            </span>
          </Listbox.Button>
          <Transition
            as={Fragment}
            leave="tw-hw-transition tw-hw-ease-in tw-hw-duration-100"
            leaveFrom="tw-hw-opacity-100"
            leaveTo="tw-hw-opacity-0"
          >
            <Listbox.Options className="tw-hw-absolute tw-hw-z-10 tw-hw-mt-2 tw-hw-max-h-60 tw-hw-min-w-full tw-hw-overflow-auto tw-hw-bg-white tw-hw-py-1 tw-hw-text-base tw-hw-shadow-lg tw-hw-ring-1 tw-hw-ring-black tw-hw-ring-opacity-5 focus:tw-hw-outline-none sm:tw-hw-text-sm">
              {options?.map((option) => (
                <Listbox.Option
                  key={option.id}
                  className={({ active }) =>
                    `${active ? 'tw-hw-bg-hyphen-gray-100' : ''}
                    tw-hw-relative tw-hw-cursor-pointer tw-hw-select-none tw-hw-py-5 tw-hw-px-5 tw-hw-text-hyphen-gray-400 hover:tw-hw-bg-hyphen-gray-100`
                  }
                  value={option}
                  disabled={!!option.disabled}
                >
                  {({ selected, active }) => (
                    <OptionContent
                      option={option}
                      active={active}
                      selected={selected}
                    />
                  )}
                </Listbox.Option>
              ))}
            </Listbox.Options>
          </Transition>
        </div>
      </Listbox>
    </div>
  );
};

export default Select;
