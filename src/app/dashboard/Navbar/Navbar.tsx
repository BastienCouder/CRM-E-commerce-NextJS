import Link from "next/link";
import {
  AiOutlineHome,
  AiOutlinePlusCircle,
  AiOutlineShopping,
} from "react-icons/ai";

export default function Navbar() {
  return (
    <ul className="menu h-screen bg-base-200 w-56">
      <li>
        <Link href={"/dashboard"}>
          <AiOutlineHome size={18} />
          <span className="mt-1">Dashboard</span>
        </Link>
      </li>
      <li>
        <details open>
          <summary>Crud</summary>
          <ul>
            <li>
              <details open>
                <summary>Create</summary>
                <ul>
                  <li>
                    <Link href={"/dashboard/add-product"}>
                      <AiOutlinePlusCircle size={18} />
                      Product
                    </Link>
                  </li>
                  <li>
                    <Link href={"/dashboard/add-category"}>
                      <AiOutlinePlusCircle size={18} />
                      Category
                    </Link>
                  </li>
                </ul>
              </details>
            </li>
          </ul>
        </details>
      </li>
      <li>
        <Link href={"/dashboard/products"}>
          <AiOutlineShopping size={18} />
          Products
        </Link>
      </li>
    </ul>
  );
}
