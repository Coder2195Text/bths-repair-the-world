import { UserFull } from "@/types/user";
import { ExecDetails } from "@prisma/client";
import {
  FC,
  PropsWithChildren,
  ReactNode,
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";
import BirthdayPopup from "./BirthdayPopup";

interface ContextType {
  status: "pending" | "registered" | "unregistered";
  data: UserFull | null;
  setData: (data: UserFull | null) => void;
  setStatus: (status: "pending" | "registered" | "unregistered") => void;
  execData: ExecDetails | null;
  setExecData: (data: ExecDetails | null) => void;
}
const AccountContext = createContext<ContextType>({
  status: "pending",
  data: null,
  setData: () => { },
  setStatus: () => { },
  execData: null,
  setExecData: () => { },
});

export const AccountProvider: FC<PropsWithChildren> = ({ children }) => {
  const [status, setStatus] = useState<ContextType["status"]>("pending");
  const [data, setData] = useState<ContextType["data"]>(null);
  const [execData, setExecData] = useState<ContextType["execData"]>(null);

  useEffect(() => {
    async function getAccount() {
      let success = false;
      while (!success) {
        try {
          return Promise.all([
            fetch("/api/users/@me").then((res) =>
              res.status == 200 ? res.json() : null
            ),
            fetch("/api/exec-desc/@me").then((res) =>
              res.status == 200 ? res.json() : null
            ),
          ]);
        } catch (e) {
          await new Promise((r) => setTimeout(r, 1000));
        }
      }
    }

    getAccount().then((data) => {
      if (data && data[0]) {
        setData(data[0]);
        setExecData(data[1]);

        setStatus("registered");
      } else {
        setStatus("unregistered");
      }
    });
  }, []);

  const today = new Date();
  const birthday = data?.birthday ? new Date(data.birthday) : undefined;

  const isBirthday =
    birthday?.getUTCDate() === today.getDate() &&
    birthday?.getUTCMonth() === today.getMonth();

  return (
    <AccountContext.Provider
      value={{
        execData,
        setExecData,
        status,
        data,
        setData,
        setStatus,
      }}
    >
      {isBirthday && <BirthdayPopup />}

      {children}
    </AccountContext.Provider>
  );
};

export function useAccount() {
  const context = useContext(AccountContext);
  if (context === undefined) {
    throw new Error("useAccount must be used within a AccountProvider");
  }
  return context;
}
