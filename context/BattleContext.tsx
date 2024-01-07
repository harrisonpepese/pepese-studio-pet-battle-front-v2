"use client";
import { socket } from "@/services/socket.service";
import TokenService from "@/services/token.service";
import { EBattleAction } from "@/types/battle/battleAction.enum";
import { EBattleEvents } from "@/types/battle/battleEvent";
import { EBattleType } from "@/types/battle/battletype.enum";
import React, { createContext, useEffect, useState } from "react";

type BattleContextType = {
  battle: any;
  findMatch: (petId: string, battleType: EBattleType) => void;
  sendRoundAction: (action: EBattleAction, targetId?: string) => void;
  reset(): void;
};
const defaultContext: BattleContextType = {
  battle: undefined,
  findMatch: () => {},
  sendRoundAction: () => {},
  reset: () => {},
};
export const BattleContext = createContext<BattleContextType>(defaultContext);
export const BattleContextProvider: React.FC<{ children: any }> = ({
  children,
}) => {
  const [battle, setBattle] = useState<any>();
  const findMatch = (petId: string, battleType: EBattleType) => {
    socket.emit("findMatch", { petId, battleType });
  };

  const sendRoundAction = (action: EBattleAction, targetId?: string) => {
    socket.emit("setRoundAction", {
      battleUuid: battle.uuid,
      action,
      targetId,
    });
  };
  const reset = () => {
    setBattle(undefined);
  };
  useEffect(() => {
    const localToken = `Bearer ${TokenService.getToken()}`;
    if (localToken) {
      socket.io.opts.extraHeaders = { authorization: localToken };
      socket.disconnect().connect();
    }
  }, []);

  useEffect(() => {
    function onConnect() {
      console.log("connected");
    }
    function onDisconnect() {
      console.log("disconnected");
    }
    function onBattleChange(data: any) {
      setBattle(data);
    }
    socket.on("connect", onConnect);
    socket.on("disconnect", onDisconnect);
    socket.on(EBattleEvents.end, onBattleChange);
    socket.on(EBattleEvents.onBattleChange, onBattleChange);
    socket.on(EBattleEvents.timerTick, onBattleChange);
    socket.on(EBattleEvents.start, onBattleChange);
    socket.on(EBattleEvents.roundStart, onBattleChange);
    socket.on(EBattleEvents.roundEnd, onBattleChange);

    return () => {
      socket.off("connect", onConnect);
      socket.off("disconnect", onDisconnect);
      socket.off(EBattleEvents.onBattleChange, onBattleChange);
      socket.off(EBattleEvents.timerTick, onBattleChange);
      socket.off(EBattleEvents.start, onBattleChange);
      socket.off(EBattleEvents.roundStart, onBattleChange);
      socket.off(EBattleEvents.roundEnd, onBattleChange);
      socket.off(EBattleEvents.end, onBattleChange);
    };
  }, []);
  return (
    <BattleContext.Provider
      value={{ battle, findMatch, sendRoundAction, reset }}
    >
      {children}
    </BattleContext.Provider>
  );
};
