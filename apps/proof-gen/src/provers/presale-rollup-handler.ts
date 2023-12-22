
import { TaskStack } from './task-stack.js';
import { SubProcessCordinator } from '@/create-sub-processes';
import { ProofPayload } from "../constant.js";
import { getLogger } from "../lib/logUtils.js";
import fs from "fs";
import { getDateString } from '@/lib';

const logger = getLogger('presale-rollup-handler');

export const presaleRollupBatchAndMerge = async (subProcessCordinator: SubProcessCordinator, proofPayloads: ProofPayload<any>[], sendCallBack?: any) => {
const filterStep = (openTasks: ProofPayload<any>[]) => {
        return openTasks;
    };
    const reducerStep = async (proofPayLoadList: ProofPayload<any>[]) => {
        if (proofPayLoadList.length == 1) return [];

        let promises: Promise<any>[] = [];
        if (!proofPayLoadList[0].isProof) {
            for (let i = 0; i < proofPayLoadList.length; i++) {
                promises.push(subProcessCordinator.presaleContributorsBatch(proofPayLoadList[i]));
            }
        } else {
            for (let i = 0; i < proofPayLoadList.length; i = i + 2) {
                if (proofPayLoadList[i + 1]) {
                    promises.push(subProcessCordinator.presaleContributorsMerge(proofPayLoadList[i], proofPayLoadList[i + 1]));
                } else {
                    promises.push(Promise.resolve(proofPayLoadList[i]));
                }
            }
        }

        proofPayLoadList = await Promise.all(promises);
        return proofPayLoadList;
    };

}
