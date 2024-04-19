use lazy_static::lazy_static;
use std::collections::HashMap;

lazy_static! {
    pub static ref OP: HashMap<&'static str, u8> = {
        let mut map = HashMap::new();
        map.insert("0", 0x00);
        map.insert("PUSHDATA1", 0x4c);
        map.insert("PUSHDATA2", 0x4d);
        map.insert("PUSHDATA4", 0x4e);
        map.insert("1NEGATE", 0x4f);
        map.insert("1", 0x51);
        map.insert("2", 0x52);
        map.insert("3", 0x53);
        map.insert("4", 0x54);
        map.insert("5", 0x55);
        map.insert("6", 0x56);
        map.insert("7", 0x57);
        map.insert("8", 0x58);
        map.insert("9", 0x59);
        map.insert("10", 0x5a);
        map.insert("11", 0x5b);
        map.insert("12", 0x5c);
        map.insert("13", 0x5d);
        map.insert("14", 0x5e);
        map.insert("15", 0x5f);
        map.insert("16", 0x60);
        map.insert("IF", 0x63);
        map.insert("NOTIF", 0x64);
        map.insert("ELSE", 0x67);
        map.insert("ENDIF", 0x68);
        map.insert("VERIFY", 0x69);
        map.insert("RETURN", 0x6a);
        map.insert("TOALTSTACK", 0x6b);
        map.insert("FROMALTSTACK", 0x6c);
        map.insert("2DROP", 0x6d);
        map.insert("2DUP", 0x6e);
        map.insert("3DUP", 0x6f);
        map.insert("2OVER", 0x70);
        map.insert("2ROT", 0x71);
        map.insert("2SWAP", 0x72);
        map.insert("IFDUP", 0x73);
        map.insert("DEPTH", 0x74);
        map.insert("DROP", 0x75);
        map.insert("DUP", 0x76);
        map.insert("NIP", 0x77);
        map.insert("OVER", 0x78);
        map.insert("PICK", 0x79);
        map.insert("ROLL", 0x7a);
        map.insert("ROT", 0x7b);
        map.insert("SWAP", 0x7c);
        map.insert("TUCK", 0x7d);
        map.insert("CAT", 0x7e);
        map.insert("SUBSTR", 0x7f);
        map.insert("LEFT", 0x80);
        map.insert("RIGHT", 0x81);
        map.insert("SIZE", 0x82);
        map.insert("INVERT", 0x83);
        map.insert("AND", 0x84);
        map.insert("OR", 0x85);
        map.insert("XOR", 0x86);
        map.insert("EQUAL", 0x87);
        map.insert("EQUALVERIFY", 0x88);
        map.insert("1ADD", 0x8b);
        map.insert("1SUB", 0x8c);
        map.insert("2MUL", 0x8d);
        map.insert("2DIV", 0x8e);
        map.insert("NEGATE", 0x8f);
        map.insert("ABS", 0x90);
        map.insert("NOT", 0x91);
        map.insert("0NOTEQUAL", 0x92);
        map.insert("ADD", 0x93);
        map.insert("SUB", 0x94);
        map.insert("MUL", 0x95);
        map.insert("DIV", 0x96);
        map.insert("MOD", 0x97);
        map.insert("LSHIFT", 0x98);
        map.insert("RSHIFT", 0x99);
        map.insert("BOOLAND", 0x9a);
        map.insert("BOOLOR", 0x9b);
        map.insert("NUMEQUAL", 0x9c);
        map.insert("NUMEQUALVERIFY", 0x9d);
        map.insert("NUMNOTEQUAL", 0x9e);
        map.insert("LESSTHAN", 0x9f);
        map.insert("GREATERTHAN", 0xa0);
        map.insert("LESSTHANOREQUAL", 0xa1);
        map.insert("GREATERTHANOREQUAL", 0xa2);
        map.insert("MIN", 0xa3);
        map.insert("MAX", 0xa4);
        map.insert("WITHIN", 0xa5);
        map.insert("BLAKE3", 0xa6);
        map.insert("DOUBLEBLAKE3", 0xa7);
        map.insert("CHECKSIG", 0xac);
        map.insert("CHECKSIGVERIFY", 0xad);
        map.insert("CHECKMULTISIG", 0xae);
        map.insert("CHECKMULTISIGVERIFY", 0xaf);
        map
    };
    pub static ref OPCODE_TO_NAME: HashMap<u8, &'static str> = {
        let mut map = HashMap::new();
        map.insert(0x00, "0");
        map.insert(0x4c, "PUSHDATA1");
        map.insert(0x4d, "PUSHDATA2");
        map.insert(0x4e, "PUSHDATA4");
        map.insert(0x4f, "1NEGATE");
        map.insert(0x51, "1");
        map.insert(0x52, "2");
        map.insert(0x53, "3");
        map.insert(0x54, "4");
        map.insert(0x55, "5");
        map.insert(0x56, "6");
        map.insert(0x57, "7");
        map.insert(0x58, "8");
        map.insert(0x59, "9");
        map.insert(0x5a, "10");
        map.insert(0x5b, "11");
        map.insert(0x5c, "12");
        map.insert(0x5d, "13");
        map.insert(0x5e, "14");
        map.insert(0x5f, "15");
        map.insert(0x60, "16");
        map.insert(0x63, "IF");
        map.insert(0x64, "NOTIF");
        map.insert(0x67, "ELSE");
        map.insert(0x68, "ENDIF");
        map.insert(0x69, "VERIFY");
        map.insert(0x6a, "RETURN");
        map.insert(0x6b, "TOALTSTACK");
        map.insert(0x6c, "FROMALTSTACK");
        map.insert(0x6d, "2DROP");
        map.insert(0x6e, "2DUP");
        map.insert(0x6f, "3DUP");
        map.insert(0x70, "2OVER");
        map.insert(0x71, "2ROT");
        map.insert(0x72, "2SWAP");
        map.insert(0x73, "IFDUP");
        map.insert(0x74, "DEPTH");
        map.insert(0x75, "DROP");
        map.insert(0x76, "DUP");
        map.insert(0x77, "NIP");
        map.insert(0x78, "OVER");
        map.insert(0x79, "PICK");
        map.insert(0x7a, "ROLL");
        map.insert(0x7b, "ROT");
        map.insert(0x7c, "SWAP");
        map.insert(0x7d, "TUCK");
        map.insert(0x7e, "CAT");
        map.insert(0x7f, "SUBSTR");
        map.insert(0x80, "LEFT");
        map.insert(0x81, "RIGHT");
        map.insert(0x82, "SIZE");
        map.insert(0x83, "INVERT");
        map.insert(0x84, "AND");
        map.insert(0x85, "OR");
        map.insert(0x86, "XOR");
        map.insert(0x87, "EQUAL");
        map.insert(0x88, "EQUALVERIFY");
        map.insert(0x8b, "1ADD");
        map.insert(0x8c, "1SUB");
        map.insert(0x8d, "2MUL");
        map.insert(0x8e, "2DIV");
        map.insert(0x8f, "NEGATE");
        map.insert(0x90, "ABS");
        map.insert(0x91, "NOT");
        map.insert(0x92, "0NOTEQUAL");
        map.insert(0x93, "ADD");
        map.insert(0x94, "SUB");
        map.insert(0x95, "MUL");
        map.insert(0x96, "DIV");
        map.insert(0x97, "MOD");
        map.insert(0x98, "LSHIFT");
        map.insert(0x99, "RSHIFT");
        map.insert(0x9a, "BOOLAND");
        map.insert(0x9b, "BOOLOR");
        map.insert(0x9c, "NUMEQUAL");
        map.insert(0x9d, "NUMEQUALVERIFY");
        map.insert(0x9e, "NUMNOTEQUAL");
        map.insert(0x9f, "LESSTHAN");
        map.insert(0xa0, "GREATERTHAN");
        map.insert(0xa1, "LESSTHANOREQUAL");
        map.insert(0xa2, "GREATERTHANOREQUAL");
        map.insert(0xa3, "MIN");
        map.insert(0xa4, "MAX");
        map.insert(0xa5, "WITHIN");
        map.insert(0xa6, "BLAKE3");
        map.insert(0xa7, "DOUBLEBLAKE3");
        map.insert(0xac, "CHECKSIG");
        map.insert(0xad, "CHECKSIGVERIFY");
        map.insert(0xae, "CHECKMULTISIG");
        map.insert(0xaf, "CHECKMULTISIGVERIFY");
        map
    };
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn test_maps() {
        for (name, opcode) in OP.iter() {
            assert_eq!(Some(*name), OPCODE_TO_NAME.get(opcode).cloned());
        }

        for (opcode, name) in OPCODE_TO_NAME.iter() {
            assert_eq!(Some(opcode), OP.get(*name));
        }
    }
}