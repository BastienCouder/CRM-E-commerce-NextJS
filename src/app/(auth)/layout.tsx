import Image from "next/image";

export default async function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <section className="h-screen">
        <div className="md:hidden">
          <Image
            src="/examples/authentication-light.png"
            width={1280}
            height={843}
            alt="Authentication"
            className="block dark:hidden"
          />
        </div>
        <div className="container relative hidden h-full flex-col items-center justify-center md:grid lg:max-w-none lg:grid-cols-2 lg:px-0">
          <div className="relative hidden h-full flex-col px-8 py-2 text-foreground lg:flex">
            <div className="absolute inset-0 bg-[#000]" />
            <div className="relative z-20 flex items-center text-lg font-medium">
              <Image
                src="/svg/logo.svg"
                width={500}
                height={500}
                alt="logo"
                className="h-[140px] w-[140px]"
              />
            </div>
            <div className="relative z-20">
              <Image
                src="/images/watch3-2.jpg"
                width={500}
                height={500}
                alt="logo"
                className="h-[20rem] w-full object-cover"
              />
              <blockquote className="space-y-2 mt-10">
                <p className="text-lg">
                  &ldquo;This library has saved me countless hours of work and
                  helped me deliver stunning designs to my clients faster than
                  ever before.&rdquo;
                </p>
                <footer className="text-sm">Sofia Davis</footer>
              </blockquote>
            </div>
          </div>
          {children}
        </div>
      </section>

      <div className="mt-8 pb-10 lg:px-16 xl:px-44"></div>
    </>
  );
}
