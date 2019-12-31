import { unsupportedOperation } from './errors'
import { Hash, HexData, Quantity, Address, BlockTag } from './model'

interface SyncStatus {
  /**
   * The block at which the import started (will only be reset, after the sync
   * reached his head)
   */
  startingBlock: Quantity,
  /**
   * The current block, same as eth_blockNumber
   */
  currentBlock: Quantity,
  /**
   * The estimated highest block
   */
  highestBlock: Quantity,
}

interface TransactionObject {
  /**
   * The address the transaction is send from.
   */
  from: Address,
  /**
   * (optional when creating new contract) The address the transaction is
   * directed to.
   */
  to?: Address,
  /**
   * (optional, default: 90000) Integer of the gas provided for the transaction
   * execution. It will return unused gas.
   */
  gas?: Quantity,
  /**
   * (optional, default: To-Be-Determined) Integer of the gasPrice used for each
   * paid gas.
   */
  gasPrice?: Quantity,
  /**
   * (optional) Integer of the value sent with this transaction.
   */
  value?: Quantity,
  /**
   * The compiled code of a contract OR the hash of the invoked method signature
   * and encoded parameters. For details see Ethereum Contract ABI
   */
  data: HexData,
  /**
   * (optional) Integer of a nonce. This allows to overwrite your own pending
   * transactions that use the same nonce.
   */
  nonce?: Quantity,
}

interface TransactionCallObject {
  /**
   * (optional) The address the transaction is sent from.
   */
  from?: Address,
  /**
   * The address the transaction is directed to.
   */
  to: Address,
  /**
   * (optional) Integer of the gas provided for the transaction execution.
   * eth_call consumes zero gas, but this parameter may be needed by some
   * executions.
   */
  gas?: Quantity,
  /**
   * (optional) Integer of the gasPrice used for each paid gas
   */
  gasPrice?: Quantity,
  /**
   * (optional) Integer of the value sent with this transaction
   */
  value?: Quantity,
  /**
   * (optional) Hash of the method signature and encoded parameters. For details
   * see Ethereum Contract ABI
   */
  data?: HexData,
}

export class RpcNode {
  /**
   * Returns the current client version.
   */
  web3_clientVersion (): string {
    throw unsupportedOperation('web3_clientVersion')
  }

  /**
   * Returns Keccak-256 (not the standardized SHA3-256) of the given data.
   * @param data the data to convert into a SHA3 hash.
   */
  web3_sha3 (data: HexData): Hash {
    throw unsupportedOperation('web3_sha3')
  }

  /**
   * Returns the current network id.
   * - `"1"`: Ethereum Mainnet
   * - `"2"`: Morden Testnet (deprecated)
   * - `"3"`: Ropsten Testnet
   * - `"4"`: Rinkeby Testnet
   * - `"42"`: Kovan Testnet
   */
  net_version (): string {
    throw unsupportedOperation('net_version')
  }

  /**
   * Returns `true` if client is actively listening for network connections.
   */
  net_listening (): boolean {
    throw unsupportedOperation('net_listening')
  }

  /**
   * Returns number of peers currently connected to the client.
   */
  net_peerCount (): Quantity {
    throw unsupportedOperation('net_peerCount')
  }

  /**
   * Returns the current ethereum protocol version.
   */
  eth_protocolVersion (): string {
    throw unsupportedOperation('eth_protocolVersion')
  }

  /**
   * Returns an object with data about the sync status or `false`.
   */
  eth_syncing (): SyncStatus | false {
    throw unsupportedOperation('eth_syncing')
  }

  /**
   * Returns the client coinbase address
   */
  eth_coinbase (): Address {
    throw unsupportedOperation('eth_coinbase')
  }

  /**
   * Returns `true` if client is actively mining new blocks.
   */
  eth_mining (): boolean {
    throw unsupportedOperation('eth_mining')
  }

  /**
   * Returns the number of hashes per second that the node is mining with.
   */
  eth_hashrate (): Quantity {
    throw unsupportedOperation('eth_hashrate')
  }

  /**
   * Returns the current price per gas in wei.
   */
  eth_gasPrice (): Quantity {
    throw unsupportedOperation('eth_gasPrice')
  }

  /**
   * Returns a list of addresses owned by client.
   */
  eth_accounts (): Address[] {
    throw unsupportedOperation('eth_accounts')
  }

  /**
   * Returns the number of most recent block.
   */
  eth_blockNumber (): Quantity {
    throw unsupportedOperation('eth_blockNumber')
  }

  /**
   * Returns the balance in wei of the account of given address.
   * @param address address to check for balance.
   * @param blockTag block number, or `"latest"`, `"earliest"` or `"pending"`.
   */
  eth_getBalance (address: Address, blockTag: BlockTag): Quantity {
    throw unsupportedOperation('eth_getBalance')
  }

  /**
   * Returns the value from a storage position at a given address.
   * @param address address of the storage.
   * @param position integer of the position in the storage.
   * @param blockTag block number, or `"latest"`, `"earliest"` or `"pending"`.
   */
  eth_getStorageAt (address: Address, position: Quantity, blockTag: BlockTag): HexData {
    throw unsupportedOperation('eth_getStorageAt')
  }

  /**
   * Returns the number of transactions sent from an address.
   * @param address address.
   * @param blockTag block number, or `"latest"`, `"earliest"` or `"pending"`.
   */
  eth_getTransactionCount (address: Address, blockTag: BlockTag): Quantity {
    throw unsupportedOperation('eth_getTransactionCount')
  }

  /**
   * Returns the number of transactions in a block from a block matching the
   * given block hash.
   * @param blockHash hash of a block.
   */
  eth_getBlockTransactionCountByHash (blockHash: Hash): Quantity {
    throw unsupportedOperation('eth_getBlockTransactionCountByHash')
  }

  /**
   * Returns the number of transactions in a block matching the given block
   * number.
   * @param blockTag block number, or `"latest"`, `"earliest"` or `"pending"`.
   */
  eth_getBlockTransactionCountByNumber (blockTag: BlockTag): Quantity {
    throw unsupportedOperation('eth_getBlockTransactionCountByNumber')
  }

  /**
   * Returns the number of uncles in a block from a block matching the given
   * block hash.
   * @param blockHash hash of a block.
   */
  eth_getUncleCountByBlockHash (blockHash: Hash): Quantity {
    throw unsupportedOperation('eth_getUncleCountByBlockHash')
  }

  /**
   * Returns the number of uncles in a block from a block matching the given
   * block number.
   * @param blockTag block number, or `"latest"`, `"earliest"` or `"pending"`.
   */
  eth_getUncleCountByBlockNumber (blockTag: BlockTag): Quantity {
    throw unsupportedOperation('eth_getUncleCountByBlockNumber')
  }

  /**
   * Returns code at a given address.
   * @param address address.
   * @param blockTag block number, or `"latest"`, `"earliest"` or `"pending"`.
   */
  eth_getCode (address: Address, blockTag: BlockTag): HexData {
    throw unsupportedOperation('eth_getCode')
  }

  /**
   * The sign method calculates an Ethereum specific signature with:
   * `sign(keccak256("\x19Ethereum Signed Message:\n" + len(message) +
   * message)))`.
   *
   * By adding a prefix to the message makes the calculated signature
   * recognisable as an Ethereum specific signature. This prevents misuse where
   * a malicious DApp can sign arbitrary data (e.g. transaction) and use the
   * signature to impersonate the victim.
   *
   * **Note** the address to sign with must be unlocked.
   * @param address address.
   * @param message message to sign.
   */
  eth_sign (address: Address, message: HexData): HexData {
    throw unsupportedOperation('eth_sign')
  }

  /**
   * Creates new message call transaction or a contract creation, if the data
   * field contains code.
   * @param transaction The transaction object.
   */
  eth_sendTransaction (transaction: TransactionObject): Hash {
    throw unsupportedOperation('eth_sendTransaction')
  }

  /**
   * Creates new message call transaction or a contract creation for signed
   * transactions.
   * @param data The signed transaction data.
   */
  eth_sendRawTransaction (data: HexData): Hash {
    throw unsupportedOperation('eth_sendRawTransaction')
  }

  /**
   * Executes a new message call immediately without creating a transaction on
   * the block chain.
   * @param call The transaction call object.
   * @param blockTag block number, or `"latest"`, `"earliest"` or `"pending"`.
   */
  eth_call (call: TransactionCallObject, blockTag: BlockTag): HexData {
    throw unsupportedOperation('eth_call')
  }

  /**
   * Generates and returns an estimate of how much gas is necessary to allow the
   * transaction to complete. The transaction will not be added to the
   * blockchain. Note that the estimate may be significantly more than the
   * amount of gas actually used by the transaction, for a variety of reasons
   * including EVM mechanics and node performance.
   * @param call The transaction call object.
   * @param blockTag block number, or `"latest"`, `"earliest"` or `"pending"`.
   */
  eth_estimateGas (call: Partial<TransactionCallObject>, blockTag: BlockTag) {
    throw unsupportedOperation('eth_estimateGas')
  }

  eth_getBlockByHash () {
    throw unsupportedOperation('eth_getBlockByHash')
  }

  eth_getBlockByNumber () {
    throw unsupportedOperation('eth_getBlockByNumber')
  }

  eth_getTransactionByHash () {
    throw unsupportedOperation('eth_getTransactionByHash')
  }

  eth_getTransactionByBlockHashAndIndex () {
    throw unsupportedOperation('eth_getTransactionByBlockHashAndIndex')
  }

  eth_getTransactionByBlockNumberAndIndex () {
    throw unsupportedOperation('eth_getTransactionByBlockNumberAndIndex')
  }

  eth_getTransactionReceipt () {
    throw unsupportedOperation('eth_getTransactionReceipt')
  }

  eth_pendingTransactions () {
    throw unsupportedOperation('eth_pendingTransactions')
  }

  eth_getUncleByBlockHashAndIndex () {
    throw unsupportedOperation('eth_getUncleByBlockHashAndIndex')
  }

  eth_getUncleByBlockNumberAndIndex () {
    throw unsupportedOperation('eth_getUncleByBlockNumberAndIndex')
  }

  /**
   * @deprecated
   */
  eth_getCompilers () {
    throw unsupportedOperation('eth_getCompilers')
  }

  /**
   * @deprecated
   */
  eth_compileSolidity () {
    throw unsupportedOperation('eth_compileSolidity')
  }

  /**
   * @deprecated
   */
  eth_compileLLL () {
    throw unsupportedOperation('eth_compileLLL')
  }

  /**
   * @deprecated
   */
  eth_compileSerpent () {
    throw unsupportedOperation('eth_compileSerpent')
  }

  eth_newFilter () {
    throw unsupportedOperation('eth_newFilter')
  }

  eth_newBlockFilter () {
    throw unsupportedOperation('eth_newBlockFilter')
  }

  eth_newPendingTransactionFilter () {
    throw unsupportedOperation('eth_newPendingTransactionFilter')
  }

  eth_uninstallFilter () {
    throw unsupportedOperation('eth_uninstallFilter')
  }

  eth_getFilterChanges () {
    throw unsupportedOperation('eth_getFilterChanges')
  }

  eth_getFilterLogs () {
    throw unsupportedOperation('eth_getFilterLogs')
  }

  eth_getLogs () {
    throw unsupportedOperation('eth_getLogs')
  }

  eth_getWork () {
    throw unsupportedOperation('eth_getWork')
  }

  eth_submitWork () {
    throw unsupportedOperation('eth_submitWork')
  }

  eth_submitHashrate () {
    throw unsupportedOperation('eth_submitHashrate')
  }

  eth_getProof () {
    throw unsupportedOperation('eth_getProof')
  }

  db_putString () {
    throw unsupportedOperation('db_putString')
  }

  db_getString () {
    throw unsupportedOperation('db_getString')
  }

  db_putHex () {
    throw unsupportedOperation('db_putHex')
  }

  db_getHex () {
    throw unsupportedOperation('db_getHex')
  }

  shh_version () {
    throw unsupportedOperation('shh_version')
  }

  shh_post () {
    throw unsupportedOperation('shh_post')
  }

  shh_newIdentity () {
    throw unsupportedOperation('shh_newIdentity')
  }

  shh_hasIdentity () {
    throw unsupportedOperation('shh_hasIdentity')
  }

  shh_newGroup () {
    throw unsupportedOperation('shh_newGroup')
  }

  shh_addToGroup () {
    throw unsupportedOperation('shh_addToGroup')
  }

  shh_newFilter () {
    throw unsupportedOperation('shh_newFilter')
  }

  shh_uninstallFilter () {
    throw unsupportedOperation('shh_uninstallFilter')
  }

  shh_getFilterChanges () {
    throw unsupportedOperation('shh_getFilterChanges')
  }

  shh_getMessages () {
    throw unsupportedOperation('shh_getMessages')
  }
}
