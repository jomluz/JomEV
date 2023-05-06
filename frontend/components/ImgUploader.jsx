import {
  Center,
  Icon,
  Spinner,
  Text,
  Tooltip,
  useDisclosure,
  VStack,
} from "@chakra-ui/react";
import { IconButton } from "@chakra-ui/react";
import React, { useCallback, useEffect, useState } from "react";
import { FiImage, FiSend } from "react-icons/fi";
import ImageUploading from "react-images-uploading"; // https://www.npmjs.com/package/react-images-uploading
import { Web3Storage } from "web3.storage";

// import { encodeMessage } from "../../helpers/message-parser";

// // Construct with token and endpoint
const token = process.env.NEXT_PUBLIC_WEB3_STORAGE_KEY;
// console.log("web3 storage key: ", token);
export const client = new Web3Storage({
  token: process.env.NEXT_PUBLIC_WEB3_STORAGE_KEY,
});

const ImageUploader = ({ onSend }) => {
  const [images, setImages] = useState([]);
  const [busy, setBusy] = useState(false);

  const disclosure = useDisclosure();
  useEffect(() => {
    if (!disclosure.isOpen) setImages([]);
    setBusy(false);
  }, [disclosure.isOpen]);

  const maxNumber = 1;

  const getImgUrl = (rootCid, fileName) =>
    `https://${rootCid}.ipfs.w3s.link/${fileName}`;

  const upload = useCallback(async () => {
    setBusy(true);
    const file = images[0].file;
    const name = file.name;
    const renamedFile = new File([file], name, { type: file.type });
    const cid = await client.put([renamedFile]);

    const uploadedUrl = getImgUrl(cid, name);
    console.log("uploaded to url: ", uploadedUrl);
    const payload = { url: uploadedUrl };
    // const encodedMsg = encodeMessage("image", payload);
    // await onSend(encodedMsg);
    setBusy(false);
    disclosure.onClose();

    return uploadedUrl;
  }, [images, client, getImgUrl, onSend]);

  const onChange = (imageList, addUpdateIndex) => {
    console.log(imageList, addUpdateIndex);
    setImages(imageList);
  };

  return (
    <div>
      <Center>
        <VStack spacing={4}>
          <ImageUploading
            multiple
            value={images}
            onChange={onChange}
            maxNumber={maxNumber}
            dataURLKey="data_url"
          >
            {({
              imageList,
              onImageUpload,
              onImageUpdate,
              isDragging,
              dragProps,
            }) => (
              // write your building UI
              <div className="upload__image-wrapper">
                {!imageList.length ? (
                  <Text
                    minWidth={"12rem"}
                    fontSize="xl"
                    fontWeight="extrabold"
                    onClick={onImageUpload}
                    color="white"
                    cursor="pointer"
                    {...dragProps}
                    {...(isDragging
                      ? {
                          bgGradient: "linear(to-l, #7928CA, #FF0080)",
                          bgClip: "text",
                        }
                      : null)}
                  >
                    Drop or click to add
                  </Text>
                ) : (
                  <></>
                )}
                {imageList.map((image, index) => (
                  <Tooltip
                    key={index}
                    hasArrow
                    placement="top"
                    label="Click to change"
                  >
                    <img
                      src={image["data_url"]}
                      alt=""
                      height="12rem"
                      onClick={() => onImageUpdate(index)}
                    />
                  </Tooltip>
                ))}
              </div>
            )}
          </ImageUploading>
          {!busy ? (
            <IconButton
              color="white"
              _hover={{
                color: "black",
                background: "white",
              }}
              onClick={upload}
              variant="outline"
              border={"none"}
              aria-label="Send image"
              icon={<Icon as={FiSend} />}
            />
          ) : (
            <Spinner />
          )}
        </VStack>
      </Center>
    </div>
  );
};

export default ImageUploader;
