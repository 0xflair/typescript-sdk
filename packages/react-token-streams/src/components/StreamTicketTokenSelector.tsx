import { BareComponentProps } from '@0xflair/react-common';
import { NftToken } from '@0xflair/react-data-query';
import { Fragment } from 'react';

import { useStreamContext } from '../providers';

type Props = BareComponentProps;

export const StreamTicketTokenSelector = ({ as, ...attributes }: Props) => {
  const {
    data: {
      walletAddress,
      ticketTokens,
      selectedTicketTokenIds,
      selectedTicketTokens,
      ticketTokenSymbol,
      ticketTokenAddress,
    },
    setSelectedTicketTokens,
  } = useStreamContext();

  const Component =
    as || (attributes.className || attributes.style ? 'span' : Fragment);

  return (
    <Component {...attributes}>
      {ticketTokens?.length ? (
        ticketTokens.map((token) => (
          <div
            key={token.tokenId}
            className="ticket-token relative flex gap-2 items-start py-1"
          >
            <div className="token-checkbox flex items-center h-5">
              <input
                id={`token-${token.tokenId}`}
                name={`token-${token.tokenId}`}
                type="checkbox"
                className="focus:ring-indigo-500 h-4 w-4 text-indigo-600 border-gray-300 rounded"
                checked={Boolean(
                  selectedTicketTokenIds?.find(
                    (t) => t.toString() === token.tokenId?.toString(),
                  ),
                )}
                onChange={(e) => {
                  const { checked } = e.target;
                  if (checked) {
                    if (
                      !selectedTicketTokens?.find(
                        (t) =>
                          t.tokenId?.toString() === token.tokenId?.toString(),
                      )
                    ) {
                      setSelectedTicketTokens([
                        ...(selectedTicketTokens || []),
                        token,
                      ]);
                    }
                  } else {
                    setSelectedTicketTokens(
                      selectedTicketTokens?.filter(
                        (t) =>
                          t.tokenId?.toString() !== token.tokenId?.toString(),
                      ) || [],
                    );
                  }
                }}
              />
            </div>
            <div className="token-label text-sm">
              <label
                htmlFor={`token-${token.tokenId}`}
                className="font-medium text-gray-700 select-none"
              >
                {ticketTokenSymbol?.toString()} # {token.tokenId?.toString()}
              </label>
            </div>
          </div>
        ))
      ) : (
        <div className="ticket-token-input col-span-2 relative flex flex-col gap-4 items-start py-4">
          <h3 className="text-sm font-medium text-gray-700">
            Manually enter Token IDs
          </h3>
          <div className="token-input flex items-center w-full">
            <input
              id="token-input"
              name="token-input"
              type="text"
              className="focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
              placeholder="123, 456, 789"
              defaultValue={selectedTicketTokenIds?.join(', ')}
              onChange={(e) => {
                const { value } = e.target;
                const tokenIds = value
                  .split(',')
                  .map((t) => t.trim())
                  .filter((t) => t.length);

                const newTokens: NftToken[] = tokenIds.map((tokenId) => ({
                  tokenId: tokenId,
                  contractAddress: ticketTokenAddress?.toString() || '',
                  ownerAddress: walletAddress?.toString() || '',
                }));

                setSelectedTicketTokens(newTokens);
              }}
            />
          </div>
        </div>
      )}
    </Component>
  );
};
