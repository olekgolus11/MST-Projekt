import { Button } from "@/components/ui/button";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { GlobeLock, Shield } from "lucide-react";

export default function Home() {
  return (
    <div className="h-screen w-screen overflow-hidden bg-linear-to-b from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
      {/* Header */}
      <header className="flex h-16 items-center justify-center border-b border-slate-200 dark:border-slate-700">
        <h1 className="text-2xl font-bold text-slate-800 dark:text-slate-100">
          Symulacja protokołu OpenVPN
        </h1>
      </header>

      {/* Main Board */}
      <main className="flex h-[calc(100vh-4rem)] items-center justify-center px-8">
        <div className="flex w-full max-w-6xl items-center justify-between">
          {/* Client Device */}
          <Card className="flex-col">
            <CardHeader>
              <CardTitle>Użytkownik końcowy</CardTitle>
              <CardDescription>Komputer Stacjonarny</CardDescription>
            </CardHeader>
            <CardFooter>
              <CardAction>
                <Dialog>
                  <DialogTrigger asChild>
                    <Button variant="outline">Wyświetl szczegóły</Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                      <DialogTitle>Share link</DialogTitle>
                      <DialogDescription>
                        Anyone who has this link will be able to view this.
                      </DialogDescription>
                    </DialogHeader>
                    <div className="flex items-center gap-2"></div>
                    <DialogFooter className="sm:justify-start">
                      <DialogClose asChild>
                        <Button type="button" variant="secondary">
                          Close
                        </Button>
                      </DialogClose>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </CardAction>
            </CardFooter>
          </Card>

          {/* Connection line: Device to VPN Client */}
          <div className="flex-1 px-2">
            <div className="h-0.5 w-full border-t-2 border-dashed border-slate-300 dark:border-slate-600" />
          </div>

          {/* VPN Client Process */}
          <Card className="border-blue-600 dark:border-blue-400">
            <CardHeader>
              <CardTitle>VPN Klient</CardTitle>
              <CardDescription>Enkrypcja danych</CardDescription>
            </CardHeader>
            <CardFooter>
              <CardAction>
                <Dialog>
                  <DialogTrigger asChild>
                    <Button variant="outline">Wyświetl szczegóły</Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                      <DialogTitle>Share link</DialogTitle>
                      <DialogDescription>
                        Anyone who has this link will be able to view this.
                      </DialogDescription>
                    </DialogHeader>
                    <div className="flex items-center gap-2"></div>
                    <DialogFooter className="sm:justify-start">
                      <DialogClose asChild>
                        <Button type="button" variant="secondary">
                          Close
                        </Button>
                      </DialogClose>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </CardAction>
            </CardFooter>
          </Card>

          {/* VPN Tunnel */}
          <div className="flex-1 px-2">
            <div className="relative flex items-center">
              <Shield className="absolute left-1/2 -top-8 -translate-x-1/2 text-blue-600 dark:text-blue-400" />
              <div className="h-0.5 w-full border-t-2 border-dashed border-slate-300 dark:border-slate-600" />
              <span className="absolute -bottom-6 left-1/2 -translate-x-1/2 whitespace-nowrap text-xs font-medium text-blue-600 dark:text-blue-400">
                Tunel VPN
              </span>
            </div>
          </div>

          {/* VPN Server Process */}
          <Card className="flex-col border-blue-600 dark:border-blue-400">
            <CardHeader>
              <CardTitle>VPN Serwer</CardTitle>
              <CardDescription>Chowa adres IP oraz geolokację</CardDescription>
            </CardHeader>
            <CardFooter>
              <CardAction>
                <Dialog>
                  <DialogTrigger asChild>
                    <Button variant="outline">Wyświetl szczegóły</Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                      <DialogTitle>Share link</DialogTitle>
                      <DialogDescription>
                        Anyone who has this link will be able to view this.
                      </DialogDescription>
                    </DialogHeader>
                    <div className="flex items-center gap-2"></div>
                    <DialogFooter className="sm:justify-start">
                      <DialogClose asChild>
                        <Button type="button" variant="secondary">
                          Close
                        </Button>
                      </DialogClose>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </CardAction>
            </CardFooter>
          </Card>
          {/* Connection line: VPN Server to Internet */}
          <div className="flex-1 px-2">
            <div className="relative flex items-center">
              <div className="h-0.5 w-full border-t-2 border-dashed border-slate-300 dark:border-slate-600" />
              <span className="absolute -bottom-6 left-1/2 -translate-x-1/2 whitespace-nowrap text-xs font-medium text-emerald-600 dark:text-emerald-400">
                Increased privacy
              </span>
            </div>
          </div>

          {/* Internet */}
          <Card className="flex flex-1 flex-col w-full">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                Internet <GlobeLock />
              </CardTitle>
              {/*<CardDescription></CardDescription>*/}
            </CardHeader>
            {/*<CardFooter>
              <CardAction>
                <Dialog>
                  <DialogTrigger asChild>
                    <Button variant="outline">ewentualne szczegóły?</Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                      <DialogTitle>Share link</DialogTitle>
                      <DialogDescription>
                        Anyone who has this link will be able to view this.
                      </DialogDescription>
                    </DialogHeader>
                    <div className="flex items-center gap-2"></div>
                    <DialogFooter className="sm:justify-start">
                      <DialogClose asChild>
                        <Button type="button" variant="secondary">
                          Close
                        </Button>
                      </DialogClose>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </CardAction>
            </CardFooter>*/}
          </Card>
        </div>
      </main>
    </div>
  );
}
