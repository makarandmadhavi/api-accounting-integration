import { BanknotesIcon } from '@heroicons/react/24/outline';
import { inter } from '@/app/ui/fonts';

export default function CompanyLogo() {
  return (
    <div
      className={`${inter.className} flex flex-row items-center leading-none text-white`}
    >
      <BanknotesIcon className="h-12 w-12 rotate-[15deg]" />
      <p className="text-[44px]">Company</p>
    </div>
  );
}

