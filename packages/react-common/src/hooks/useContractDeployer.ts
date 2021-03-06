import '@ethersproject/abstract-provider';

import { Contract, ContractFactory, ContractInterface, Signer } from 'ethers';
import * as React from 'react';
import { useMemo } from 'react';

import { useCancel } from './useCancel';

export type ContractDeployerConfig = {
  /** Contract interface or ABI */
  contractInterface: ContractInterface;
  /** Contract bytecode */
  contractByteCode: string;
  /** Signer to attach to contract */
  signer?: Signer;
};

const newContractFactory = <T = ContractFactory>({
  contractInterface,
  contractByteCode,
  signer,
}: ContractDeployerConfig) =>
  <T>(
    (<unknown>new ContractFactory(contractInterface, contractByteCode, signer))
  );

type State = {
  contract?: Contract;
  error?: Error;
  isLoading?: boolean;
};

const initialState: State = {
  isLoading: false,
};

export const useContractDeployer = <ArgsType extends any[]>({
  contractInterface,
  contractByteCode,
  signer,
}: Partial<ContractDeployerConfig>) => {
  const [state, setState] = React.useState<State>(initialState);

  const contractFactory = useMemo(() => {
    if (!contractInterface || !contractByteCode) {
      return null;
    }

    return newContractFactory<ContractFactory>({
      contractInterface,
      contractByteCode,
      signer,
    });
  }, [contractInterface, contractByteCode, signer]);

  const cancelQuery = useCancel();
  const deployContract = React.useCallback(
    async (...args: ArgsType) => {
      if (!contractFactory) {
        console.warn(`Contract factory is not defined yet`);
        return;
      }

      let didCancel = false;
      cancelQuery(() => {
        didCancel = true;
      });

      try {
        setState((x) => ({ ...x, error: undefined, isLoading: true }));

        const contract = await contractFactory.deploy(...args);
        if (!didCancel) {
          setState((x) => ({ ...x, contract }));
        }

        const receipt = await contract.deployTransaction.wait(2);
        if (!didCancel) {
          setState((x) => ({ ...x, isLoading: false }));
        }

        return { data: { contract, receipt }, error: undefined };
      } catch (error_) {
        const error = <Error>error_;

        if (!didCancel) {
          setState((x) => ({ ...x, error, isLoading: false }));
        }

        return { data: undefined, error };
      }
    },
    [cancelQuery, contractFactory]
  );

  return {
    data: state.contract,
    error: state.error,
    isLoading: state.isLoading,
    deployContract,
  } as const;
};
