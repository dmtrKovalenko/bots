import { DateTime } from "luxon";
import { SMART_ADD_SERVICE } from "../../../../constants/messages";
import StandManager from "../../../../managers/StandManager";
import Parser from "../../../../services/Parser";
import { MessageRegexp } from "../BaseAction";
import BaseCompositeAction from "./BaseCompositeAction";

enum ServiceStep {
  DATE,
  START_TIME,
  END_TIME,
}

interface ISmartServiceMeta {
  date?: string;
  startTime?: string;
  endTime?: string;
}

export default class SmartServiceAction extends BaseCompositeAction<ServiceStep, ISmartServiceMeta> {
  public regexp = new MessageRegexp(/^Записаться/i);

  public async execute() {
    await this.setActionStep(ServiceStep.DATE, {});
    this.context.sendMessage(SMART_ADD_SERVICE.WHEN);
  }

  public async executeStep(step: ServiceStep, meta: ISmartServiceMeta) {
    switch (step) {
      case ServiceStep.DATE:
        return this.longRunning(() => this.executeDay(meta));

      case ServiceStep.START_TIME:
        return this.executeStartTime(meta);

      case ServiceStep.END_TIME:
        return this.longRunning(() => this.executeEndTime(meta));
    }
  }

  private async executeDay(meta: ISmartServiceMeta) {
    const { text } = this.context.message;
    const manager = new StandManager(this.userProfile);

    const date = Parser.parseDate(text);
    meta.date = date.toISO();

    await this.setActionStep(ServiceStep.START_TIME, meta);

    this.sendMessage(SMART_ADD_SERVICE.HERE_IS_SCHEDULE + await manager.getServicesOnDate(date));
    this.sendMessage(SMART_ADD_SERVICE.START_TIME);
  }

  private async executeStartTime(meta: ISmartServiceMeta) {
    const { text } = this.context.message;

    const baseDate = DateTime.fromISO(meta.date!);
    meta.startTime = Parser.parseTime(text, baseDate).toISO();

    await this.setActionStep(ServiceStep.END_TIME, meta);
    this.sendMessage(SMART_ADD_SERVICE.END_TIME);
  }

  private async executeEndTime(meta: ISmartServiceMeta) {
    const { text } = this.context.message;

    const baseDate = DateTime.fromISO(meta.date!);
    const end = Parser.parseTime(text, baseDate);
    const start = DateTime.fromISO(meta.startTime!);

    const manager = new StandManager(this.userProfile);
    this.sendMessage(await manager.addService(start, end));

    await this.finishAction();
  }
}
