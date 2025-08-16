import ContactLinks from "@/components/contact-links";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function Payment() {
  return (
    <>
      <Link href={"/"}>
        <Button className="mt-4 ml-4">
          <ArrowLeft /> Back
        </Button>
      </Link>
      <div className="max-w-4xl mx-auto px-8 mt-4">
        <h1 className="scroll-m-20 text-center text-4xl font-extrabold tracking-tight text-balance">
          Whoops...
        </h1>
        <p className="leading-7 [&:not(:first-child)]:mt-6">
          Hey there! Thanks a lot for signing up, we saw you hadn't quite
          finished the payment so could you please remove Posturai from
          whichever account you had linked it to when you first registered then
          register it again.
        </p>
        <p className="leading-7 [&:not(:first-child)]:mt-6">
          If you have any questions, issues, or feedback then feel free to reach
          out using one of the buttons below!
        </p>
        <ContactLinks />
      </div>
    </>
  );
}
