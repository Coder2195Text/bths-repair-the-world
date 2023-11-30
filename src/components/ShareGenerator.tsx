"use client";
import { useSession } from "next-auth/react";
import { Dispatch, FC, SetStateAction } from "react";
import CopyTextarea from "./CopyTextarea";
import PopupUI from "./PopupUI";

interface Props {
  setOpen: Dispatch<SetStateAction<boolean>>;
}

const ShareGenerator: FC<Props> = ({ setOpen }) => {
  const { data } = useSession();
  const allowed = Boolean(data?.user?.email);

  return (
    <PopupUI setOpen={setOpen}>
      <h5>
        {allowed
          ? "Sharing Club Invite"
          : "Please Sign In to Share Club Invite"}
        <br />
      </h5>
      <h6>
        Inviting someone will earn you 5 points, up to a max of 100 points.
        Either use this link for them to sign up, or have them enter your email
        in the referral box when they sign up.
        <br />
        <a
          onClick={() => {
            setOpen(false);
          }}
          className="ml-2"
        >
          Exit
        </a>
      </h6>
      Here is your invite link.
      <br />
      {allowed && (
        <>
          <CopyTextarea lines={1}>
            https://bths-repair.org/invite?ref={data?.user.email}
          </CopyTextarea>
        </>
      )}
    </PopupUI>
  );
};

export default ShareGenerator;
