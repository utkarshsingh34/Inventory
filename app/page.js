'use client'
import Image from "next/image";
import { useState, useEffect} from 'react'
import { firestore } from '@/firebase'
import { Box, TextField, Typography, Button, Stack, Modal, Autocomplete } from '@mui/material'
import { collection, deleteDoc, query, getDocs, doc, getDoc, setDoc } from 'firebase/firestore'

export default function Home() {
  const [inventory, setInventory] = useState([])
  const [open, setOpen] = useState([false])
  const [itemName, setItemName] = useState('')
  const [searchTerm, setSearchTerm] = useState('')
  const [searchResult, setSearchResult] = useState(null)
  const [filteredInventory, setFilteredInventory] = useState([])

  const updateInventory = async () => {
    const snapshot = query(collection(firestore, 'inventory'))
    const docs = await getDocs(snapshot)
    const inventoryList = []
    docs.forEach((doc) => {
      inventoryList.push({name: doc.id, ...doc.data()})
    })
    setInventory(inventoryList)
    setFilteredInventory(inventoryList)
  }

  const removeItem = async (item) => {
    const docRef = doc(collection(firestore, 'inventory'), item)
    const docSnap = await getDoc(docRef)

    if (docSnap.exists()) {
      const {quantity} = docSnap.data()
      if (quantity === 1) {
        await deleteDoc(docRef)
      } else {
        await setDoc(docRef, {quantity: quantity - 1})
      }
    }

    await updateInventory()
    if (searchResult && searchResult.name === item) {
      setSearchResult(prev => ({...prev, quantity: prev.quantity - 1}))
    }
  }

  const addItem = async (item) => {
    const docRef = doc(collection(firestore, 'inventory'), item)
    const docSnap = await getDoc(docRef)

    if (docSnap.exists()) {
      const {quantity} = docSnap.data()
      await setDoc(docRef, {quantity: quantity + 1})
    } else {
      await setDoc(docRef, {quantity: 1})
    }

    await updateInventory()
    if (searchResult && searchResult.name === item) {
      setSearchResult(prev => ({...prev, quantity: prev.quantity + 1}))
    }
  }

  useEffect(() => {
    updateInventory()
  }, [])

  const handleOpen = () => {
    setOpen(true)
  }

  const handleClose = () => {
    setOpen(false)
  }

  const handleSearch = (event, newValue) => {
    if (newValue) {
      setSearchResult(newValue)
    } else {
      setSearchResult(null)
    }
  }

  const handleInputChange = (event, newInputValue) => {
    setSearchTerm(newInputValue)
    const filtered = inventory.filter(item => 
      item.name.toLowerCase().includes(newInputValue.toLowerCase())
    )
    setFilteredInventory(filtered)
  }

  return <Box width = "100vw" height = "100vh" display = "flex" justifyContent = "center" alignItems = "center" flexDirection = "column" gap = {2}>
    <Modal
    open = {open}
    onClose = {handleClose}
    aria-labelledby = "simple-modal-title"
    aria-describedby = "simple-modal-description"
    >
    <Box position = "absolute" top = "50%" left = "50%" display = "flex" flexDirection = "column" gap = {2}
    sx = {{transform: 'translate(-50%,-50%)', width: '400px', backgroundColor: '#fff', padding: '20px', borderRadius: '10px', boxShadow: '0 0 10px 0 rgba(0, 0, 0, 0.1)'}}
    >

      <Typography variant = "h6">Add Item</Typography>
      <TextField variant = "outlined" fullWidth label = "Item Name" value = {itemName} onChange = {(e) => setItemName(e.target.value)} />
      <Button 
      onClick = {() => {
        addItem(itemName)
        setItemName('')
        handleClose()
      }}>Add
      
      </Button>
    </Box>
    </Modal>
    <Button variant = "contained" onClick = {handleOpen}>Add New Item</Button>
    <Box display="flex" alignItems="center" gap={2}>
      <Autocomplete
        options={filteredInventory}
        getOptionLabel={(option) => option.name}
        style={{ width: 300 }}
        renderInput={(params) => <TextField {...params} label="Search Item" variant="outlined" />}
        onInputChange={handleInputChange}
        onChange={handleSearch}
        value={searchResult}
      />
    </Box>
    {searchResult && (
      <Box border="1px solid #333" padding={2} marginTop={2}>
        <Typography variant="h6">{searchResult.name.charAt(0).toUpperCase() + searchResult.name.slice(1)}</Typography>
        <Typography>Quantity: {searchResult.quantity}</Typography>
        <Stack direction="row" spacing={2} marginTop={1}>
          <Button variant="contained" color="error" onClick={() => removeItem(searchResult.name)}>Remove</Button>
          <Button variant="contained" color="primary" onClick={() => addItem(searchResult.name)}>Add</Button>
        </Stack>
      </Box>
    )}
    <Box border = "1px solid #333">
      <Box width = "800px" height = "100px" bgcolor = "#ADD8E6" alignItems = "center" display = "flex" justifyContent = "center">
        <Typography variant = "h2" color = "#333" >Inventory Items</Typography>
      </Box>
    <Stack width = "800px" height = "300px" spacing = {2} overflow = "auto">
      {
        inventory.map(({name, quantity}) => (
          <Box key={name} minHeight="150px" width="100%" display="flex" justifyContent="space-between" alignItems="center" padding={5} bgcolor="#f0f0f0">
            <Typography variant="h3" color="#333" textAlign = "center">{name.charAt(0).toUpperCase() + name.slice(1)}</Typography>
            <Typography variant="h3" color="#333" textAlign = "center">{quantity}</Typography> 
            <Stack direction="row" spacing={2}>
            <Button variant="contained" color="error" onClick={() => removeItem(name)}>Remove</Button>
            <Button variant="contained" color="primary" onClick={() => addItem(name)}>Add</Button>
            </Stack>

          </Box>
        ))
      }
  
    </Stack>
    </Box>
  </Box>
}
