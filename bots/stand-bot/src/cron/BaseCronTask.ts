import { BaseCronTask as CronTask } from "bot-core";
import config from "../constants/config";
import StandManager from "../managers/StandManager";
import TeamUpService from "../services/TeamUpService";

export abstract class BaseCronTask extends CronTask {
  public teamUpService = new TeamUpService(config.serviceUserProfile);
  public standManager = new StandManager(config.serviceUserProfile);
}
