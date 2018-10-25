import { BaseCronTask } from "bot-core";
import config from "../constants/config";
import { getRandomItem } from "../helpers/utils";

export default class ManagerJob extends BaseCronTask {
  public cronTime = "0 0 10 * * 1-5"; // every day at 10:00

  private jsTeam = [
    "Сакун Саша",
    "Taтьяна Ткаченко",
    "Коваленко Дима",
    "Миронец Маша",

    "Маша Шеин",
    "Таня Болжеларская",
  ];

  public async onTick() {
    const devToDeploy = getRandomItem(this.jsTeam);

    this.sendMessageToUserChats(`Сегодня деплоит ${devToDeploy}`, config.chats);
  }
}
