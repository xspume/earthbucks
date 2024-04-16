use crate::block::Block;
use crate::header::Header;
use crate::merkle_txs::MerkleTxs;
use crate::script::Script;
use crate::tx::Tx;
use crate::tx_input::TxInput;
use crate::tx_output::TxOutput;

pub struct BlockBuilder {
    pub header: Header,
    pub txs: Vec<Tx>,
    pub merkle_txs: MerkleTxs,
}

impl BlockBuilder {
    pub fn new(header: Header, txs: Vec<Tx>, merkle_txs: MerkleTxs) -> Self {
        Self {
            header,
            txs,
            merkle_txs,
        }
    }

    pub fn from_block(block: Block) -> Self {
        let header = block.header;
        let txs = block.txs;
        let merkle_txs = MerkleTxs::new(txs.clone());
        Self::new(header, txs, merkle_txs)
    }

    pub fn from_genesis(output_script: Script, output_amount: u64, new_timestamp: u64) -> Self {
        let mut header = Header::from_genesis(new_timestamp);
        let tx_input = TxInput::from_coinbase(output_script.clone());
        let tx_output = TxOutput::new(output_amount, output_script.clone());
        let coinbase_tx = Tx::new(1, vec![tx_input], vec![tx_output], 0);
        let txs = vec![coinbase_tx];
        let merkle_txs = MerkleTxs::new(txs.clone());
        let root: [u8; 32] = merkle_txs.root.clone().try_into().unwrap();
        header.merkle_root = root;
        Self::new(header, txs, merkle_txs)
    }
}

#[cfg(test)]
mod tests {
    use super::*;
    use crate::block::Block;
    use crate::header::Header;
    use crate::tx::Tx;

    #[test]
    fn test_from_block() {
        let bh = Header::new(1, [0u8; 32], [0u8; 32], 0, [0u8; 32], [0u8; 32], 0);
        let tx = Tx::new(1, vec![], vec![], 0);
        let block = Block::new(bh.clone(), vec![tx]);
        let bb = BlockBuilder::from_block(block);
        assert_eq!(bb.header.version, bh.version);
        assert_eq!(bb.header.prev_block_id, bh.prev_block_id);
        assert_eq!(bb.header.merkle_root, bh.merkle_root);
        assert_eq!(bb.header.timestamp, bh.timestamp);
        assert_eq!(bb.header.target, bh.target);
    }
}