import { User } from "@prisma/client";
import {
  FC,
  ReactNode,
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";

interface ContextType {
  status: "pending" | "registered" | "unregistered";
  data: User | null;
  setData: (data: User | null) => void;
  setStatus: (status: "pending" | "registered" | "unregistered") => void;
}
const AccountContext = createContext<ContextType>({
  status: "pending",
  data: null,
  setData: () => { },
  setStatus: () => { },
});

export const AccountProvider: FC<{ children: ReactNode }> = ({ children }) => {
  const [status, setStatus] = useState<ContextType["status"]>("pending");
  const [data, setData] = useState<ContextType["data"]>(null);

  useEffect(() => {
    async function getAccount() {
      let success = false;
      while (!success) {
        try {
          return await fetch("/api/users/@me").then((res) =>
            res.status == 200 ? res.json() : null
          );
        } catch (e) {
          await new Promise((r) => setTimeout(r, 1000));
        }
      }
    }

    getAccount().then((data) => {
      if (data) {
        setData(data);
        setStatus("registered");
      } else {
        setStatus("unregistered");
      }
    });
  }, []);

  return (
    <AccountContext.Provider
      value={{
        status,
        data,
        setData,
        setStatus,
      }}
    >
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
